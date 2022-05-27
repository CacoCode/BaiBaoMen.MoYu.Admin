import { AppComponentBase } from '@shared/component-base/app-component-base';
import { Component, Injector, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

import {
  AccountServiceProxy,
  RegisterInput,
  RegisterOutput,
} from '@shared/service-proxies/service-proxies';

import { appModuleAnimation } from '@shared/animations/routerTransition';

import { LoginService } from '../login/login.service';
import { AppCaptchaType } from '@shared/AppEnums';
import { CaptchaComponent } from 'account/component/captcha/captcha.component';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  animations: [appModuleAnimation()],
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  model: RegisterInput;
  saving = false;


  /**
   * 是否使用验证码
   */
  get useCaptcha(): boolean {
    return this.setting.getBoolean('App.UseCaptchaOnUserRegistration');
  }

  /**
   * 如果使用验证码,获取长度
   */
  get captchaLength(): number {
    return this.setting.getInt('App.CaptchaOnUserRegistrationLength');
  }

  /**
   * 验证码类型
   */
  get captchaType(): number {
    return AppCaptchaType.TenantUserRegister;
    // if (this.appSession.tenantId) {
    //   return AppCaptchaType.TenantUserRegister;
    // } else {
    //   return AppCaptchaType.HostUserLogin;
    // }
  }
  // 验证码组件
  @ViewChild('captcha', { read: '', static: false }) captcha: CaptchaComponent;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private readonly _loginService: LoginService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.titleSrvice.setTitle(this.l('CreateAnAccount'));

    if (!this.appSession.tenant) {
      this.back();
      return;
    }

    this.model = new RegisterInput();
  }

  onKey(e: KeyboardEvent): any {
    if (e.key === 'Tab') {
      this.captcha.initImg();
    }
  }

  back(): void {
    this._router.navigate(['/account/login']);
  }

  save(): void {
    this.saving = true;
    this._accountService
      .register(this.model)
      .finally(() => {
        this.saving = false;
      })
      .subscribe((result: RegisterOutput) => {
        if (!result.canLogin) {
          this.notify.success(this.l('SuccessfullyRegistered'));
          this._router.navigate(['/login']);
          return;
        }

        this.saving = true;

        // Autheticate
        this._loginService.authenticateModel.userNameOrEmailAddress = this.model.userName;
        this._loginService.authenticateModel.password = this.model.password;
        this._loginService.authenticate(() => {
          this.saving = false;
        });
      });
  }
}
