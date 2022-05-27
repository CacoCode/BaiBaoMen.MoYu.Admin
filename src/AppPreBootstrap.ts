import { UtilsService } from '@abp/utils/utils.service';
import { CompilerOptions, NgModuleRef, Type } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppConsts } from '@shared/AppConsts';
import { SubdomainTenancyNameFinder } from '@shared/helpers/SubdomainTenancyNameFinder';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LocalizedResourcesHelper } from './shared/helpers/LocalizedResourcesHelper';
import { UrlHelper } from './shared/helpers/UrlHelper';
import { environment } from './environments/environment';

import { PermissionService } from '@shared/auth/permission.service';
import { Injector } from '@angular/core';
import { ALAIN_I18N_TOKEN, MenuService } from '@delon/theme';
import { LocalizationService } from '@shared/i18n/localization.service';
import { AppMenus } from '@shared/AppMenus';
import { CustomAppMenus } from '@shared/CustomAppMenus';
import { AppAuthService } from '@shared/auth';

export class AppPreBootstrap {

  static run(appRootUrl: string, callback: () => void, resolve: any, reject: any, injector: Injector): void {
    AppPreBootstrap.getApplicationConfig(appRootUrl, () => {
      if (UrlHelper.isInstallUrl(location.href)) {
        LocalizedResourcesHelper.loadLocalizedStylesForTheme('default', false);
        callback();
        return;
      }

      const queryStringObj = UrlHelper.getQueryParameters();

      if (queryStringObj.redirect && queryStringObj.redirect === 'TenantRegistration') {
        if (queryStringObj.forceNewRegistration) {
          new AppAuthService().logout();
        }

        location.href = AppConsts.appBaseUrl + '/account/select-edition';
      } else if (queryStringObj.impersonationToken) {
        AppPreBootstrap.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback, injector); });
      } else if (queryStringObj.switchAccountToken) {
        AppPreBootstrap.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => { AppPreBootstrap.getUserConfiguration(callback, injector); });
      } else {
        AppPreBootstrap.getUserConfiguration(callback, injector);
      }
    });
  }

  static bootstrap<TM>(moduleType: Type<TM>, compilerOptions?: CompilerOptions | CompilerOptions[]): Promise<NgModuleRef<TM>> {
    return platformBrowserDynamic().bootstrapModule(moduleType, compilerOptions);
  }

  private static getApplicationConfig(appRootUrl: string, callback: () => void) {
    const type = 'GET';
    const url = appRootUrl + 'assets/' + environment.appConfig;
    const customHeaders = [
      {
        name: 'Abp.TenantId',
        value: abp.multiTenancy.getTenantIdCookie() + ''
      }];

    UrlHelper.ajax(type, url, customHeaders, null, (result) => {
      const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder();
      const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl);

      AppConsts.appBaseUrlFormat = result.appBaseUrl;
      AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl;
      AppConsts.localeMappings = result.localeMappings;

      if (tenancyName == null) {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '');
      } else {
        AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
        AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName);
      }

      callback();
    });
  }

  private static getCurrentClockProvider(currentProviderName: string): abp.timing.IClockProvider {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
  }

  private static impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void): void {
    abp.multiTenancy.setTenantIdCookie(tenantId);
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

    const requestHeaders = {
      '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
      'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
    };

    UrlHelper.ajax(
      'POST',
      AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
      requestHeaders,
      null,
      (response) => {
        const result = response.result;
        abp.auth.setToken(result.accessToken);
        AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
        location.search = '';
        callback();
      }
    );
  }

  private static linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): void {
    abp.multiTenancy.setTenantIdCookie(tenantId);
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

    const requestHeaders = {
      '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
      'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
    };

    UrlHelper.ajax(
      'POST',
      AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
      requestHeaders,
      null,
      (response) => {
        const result = response.result;
        abp.auth.setToken(result.accessToken);
        AppPreBootstrap.setEncryptedTokenCookie(result.encryptedAccessToken);
        location.search = '';
        callback();
      }
    );
  }

  private static getUserConfiguration(callback: () => void, injector: Injector): any {
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');
    const token = abp.auth.getToken();

    const requestHeaders = {
      '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
      'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
    };

    if (token) {
      requestHeaders['Authorization'] = 'Bearer ' + token;
    }

    return UrlHelper.ajax('GET', AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', requestHeaders, null, (response) => {
      const result = response.result;

      _.merge(abp, result);

      abp.clock.provider = this.getCurrentClockProvider(result.clock.provider);

      moment.locale(abp.localization.currentLanguage.name);
      (window as any).moment.locale(abp.localization.currentLanguage.name);

      if (abp.clock.provider.supportsMultipleTimezone) {
        moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
        (window as any).moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
      }

      abp.event.trigger('abp.dynamicScriptsInitialized');

      // 权限
      const permissionService = injector.get(PermissionService);
      permissionService.extend(abp.auth);

      // 本地化
      const localization = injector.get<LocalizationService>(ALAIN_I18N_TOKEN);
      localization.extend(abp.localization);


      // 写入菜单
      const menuService = injector.get(MenuService);
      const menus = AppMenus.Menus.concat(CustomAppMenus.Menus);
      menuService.add(menus);
      // menuService.add(CustomAppMenus.Menus);

      console.log(menuService);

      AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
      /*
      * 可为空参数为什么必须传null
       */
      AppConsts.subscriptionExpireNootifyDayCount = parseInt(abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'), null);

      LocalizedResourcesHelper.loadResources(callback);
    });
  }

  private static setEncryptedTokenCookie(encryptedToken: string) {
    new UtilsService().setCookieValue(AppConsts.authorization.encrptedAuthTokenName,
      encryptedToken,
      new Date(new Date().getTime() + 365 * 86400000), // 1 year
      abp.appPath
    );
  }
}
