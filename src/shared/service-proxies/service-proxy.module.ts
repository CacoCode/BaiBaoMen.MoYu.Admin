import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { MagicodesHttpInterceptor } from './magicodesHttpInterceptor';

import * as ApiServiceProxies from '@shared/service-proxies/service-proxies';
import * as CustomApiServiceProxies from '@shared/service-proxies/custom-service-proxies';
import * as AuthApiServiceProxies from '@shared/service-proxies/auth-service-proxies';

@NgModule({
  providers: [
    ApiServiceProxies.AccountServiceProxy,
    ApiServiceProxies.AuditLogServiceProxy,
    ApiServiceProxies.LanguageServiceProxy,
    ApiServiceProxies.NotificationServiceProxy,
    ApiServiceProxies.OrganizationUnitServiceProxy,
    ApiServiceProxies.PermissionServiceProxy,
    ApiServiceProxies.ProfileServiceProxy,
    ApiServiceProxies.RoleServiceProxy,
    ApiServiceProxies.SessionServiceProxy,
    ApiServiceProxies.TenantServiceProxy,
    AuthApiServiceProxies.TokenAuthServiceProxy,
    ApiServiceProxies.UserServiceProxy,
    ApiServiceProxies.UserLoginServiceProxy,
    ApiServiceProxies.HostSettingsServiceProxy,
    // ApiServiceProxies.HostCachingServiceProxy,
    // ApiServiceProxies.WebSiteLogServiceProxy,
    ApiServiceProxies.TenantSettingsServiceProxy,
    ApiServiceProxies.TenantRegistrationServiceProxy,
    ApiServiceProxies.EditionServiceProxy,
    ApiServiceProxies.TimingServiceProxy,
    ApiServiceProxies.CommonLookupServiceProxy,
    ApiServiceProxies.CommonServiceProxy,
    CustomApiServiceProxies.WxUserServiceProxy,
    { provide: HTTP_INTERCEPTORS, useClass: MagicodesHttpInterceptor, multi: true },
  ],
})
export class ServiceProxyModule { }
