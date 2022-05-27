import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';

@Injectable()
export class AppAuthService {
  logout(reload?: boolean, returnUrl?: string): void {
    const customHeaders = {
      'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
      'Authorization': 'Bearer ' + abp.auth.getToken()
    };

    UrlHelper.ajax(
      'GET',
      AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LogOut',
      customHeaders,
      null,
      () => {
        abp.auth.clearToken();
        abp.utils.setCookieValue('enc_auth_token', undefined);

        if (reload !== false) {
          if (returnUrl) {
            location.href = returnUrl;
          } else {
            location.href = '';
          }
        }
      }
    );
  }
}
