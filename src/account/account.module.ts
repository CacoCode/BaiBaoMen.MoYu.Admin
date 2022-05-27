import { ForgotPasswordComponent } from './passwords/forgot-password.component';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AccountRoutingModule } from './account-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';

import { SharedModule } from '@shared/shared.module';

import { AccountComponent } from './account.component';
import { TenantChangeComponent } from './tenant/tenant-change.component';
import { TenantChangeModalComponent } from './tenant/tenant-change-modal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountLanguagesComponent } from './account-languages/account-languages.component';

import { LoginService } from './login/login.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AbpModule } from '@abp/abp.module';
import { ResetPasswordComponent } from './passwords/reset-password.component';
import { TenantRegisterComponent } from './tenant-register/tenant-register.component';
import { CaptchaComponent } from './component/captcha/captcha.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    AbpModule,
    // CommonModule,
    // FormsModule,
    // HttpModule,
    // JsonpModule,
    // NgZorroAntdModule,
    // AbpModule,
    // SharedModule,
    // ServiceProxyModule,
    AccountRoutingModule,
  ],
  declarations: [
    AccountComponent,
    TenantChangeComponent,
    TenantChangeModalComponent,
    LoginComponent,
    RegisterComponent,
    AccountLanguagesComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    TenantRegisterComponent,
    CaptchaComponent
  ],
  entryComponents: [TenantChangeModalComponent],
  providers: [LoginService,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class AccountModule { }
