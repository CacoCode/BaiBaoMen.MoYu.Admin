import { browser } from 'protractor';
import { AppConsts } from '@shared/AppConsts';
import { TokenAuthServiceProxy } from '@shared/service-proxies/auth-service-proxies';
import {
    Component,
    Injector,
    ElementRef,
    ViewChild,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import { AbpSessionService } from '@abp/session/abp-session.service';
import {
    SessionServiceProxy,
    UpdateUserSignInTokenOutput,
} from '@shared/service-proxies/service-proxies';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { AppSessionService } from '@shared/session/app-session.service';
import { AppCaptchaType } from '@shared/AppEnums';
import { CaptchaComponent } from 'account/component/captcha/captcha.component';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    animations: [appModuleAnimation()],
})
export class LoginComponent extends AppComponentBase implements OnInit {
    submitting = false;

    // 是否启用验证码
    isEnabledVerification: boolean;
    verificationImgUrl = '';


    /**
     * 是否已选中租户
     */
    get multiTenancySideIsTeanant(): boolean {
        return this.appSession.tenantId > 0;
    }

    /**
     * 允许注册租户
     */
    get isTenantSelfRegistrationAllowed(): boolean {
        if (this.appSession.tenantId) {
            return false;
        }
        return this.setting.getBoolean('App.Host.AllowSelfRegistration');
    }

    /**
     * 允许注册用户
     */
    get isSelfRegistrationAllowed(): boolean {
        if (!this.appSession.tenantId) {
            return false;
        }
        return this.setting.getBoolean('App.AllowSelfRegistrationUser');
    }

    /**
     * 如果使用验证码,获取长度
     */
    get captchaLength(): number {
        return this.setting.getInt('App.CaptchaOnUserLoginLength');
    }

    /**
     * 验证码类型
     */
    get captchaType(): number {
        if (this.appSession.tenantId) {
            return AppCaptchaType.TenantUserLogin;
        } else {
            return AppCaptchaType.HostUserLogin;
        }
    }

    // 验证码组件
    @ViewChild('captcha', { read: '', static: false }) captcha: CaptchaComponent;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _abpSessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy,

    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.titleSrvice.setTitle(this.l('LogIn'));

        if (this._abpSessionService.userId > 0 && UrlHelper.getReturnUrl()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl =
                        initialReturnUrl +
                        (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' +
                        result.signInToken +
                        '&userId=' +
                        result.encodedUserId +
                        '&tenantId=' +
                        result.encodedTenantId;

                    location.href = returnUrl;
                });
        }

    }

    onKey(e: KeyboardEvent): any {
        if (e.key === 'Tab') {
            this.captcha.initImg();
        }
    }

    getCaptchaType(): number {
        if (this.appSession.tenantId) {
            return AppCaptchaType.TenantUserLogin;
        } else {
            return AppCaptchaType.HostUserLogin;
        }
    }

    login(): void {
        this.submitting = true;
        this.loginService.authenticate((success: boolean) => {
            this.submitting = false;
        });
    }
}
