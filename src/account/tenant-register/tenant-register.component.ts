import { CaptchaComponent } from 'account/component/captcha/captcha.component';
import { LoginService } from 'account/login/login.service';
import { finalize } from 'rxjs/operators';

import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppCaptchaType } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import { TenantRegistrationServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tenant-register',
  templateUrl: './tenant-register.component.html',
  styleUrls: ['./tenant-register.component.less'],
  animations: [appModuleAnimation()],
})
export class TenantRegisterComponent extends AppComponentBase
  implements OnInit {
  // model: CreateTenantDto = new CreateTenantDto();

  /**
   * 是否使用验证码
   */
  get useCaptcha(): boolean {
    return this.setting.getBoolean('App.Host.UseCaptchaOnTenantRegistration');
  }

  /**
   * 如果使用验证码,获取长度
   */
  get captchaLength(): number {
    return this.setting.getInt('App.Host.CaptchaOnTenantRegistrationLength');
  }

  /**
   * 验证码类型
   */
  get captchaType(): number {
    return AppCaptchaType.HostTenantRegister;
  }
  // 验证码组件
  @ViewChild('captcha', { read: '', static: false }) captcha: CaptchaComponent;

  constructor(
    injector: Injector,
    private _router: Router,
    private readonly _loginService: LoginService,
    private readonly _tenantRegisterService: TenantRegistrationServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.titleSrvice.setTitle(this.l('TenantRegister'));

    if (this.appSession.tenant) {
      this.back();
      return;
    }
  }

  back(): void {
    this._router.navigate(['/account/login']);
  }

  onKey(e: KeyboardEvent): any {
    if (e.key === 'Tab') {
      this.captcha.initImg();
    }
  }

  save(): void {
    this.saving = true;
    // this._tenantRegisterService
    //   .registerTenantAsync(this.model)
    //   .pipe(
    //     finalize(() => {
    //       this.saving = false;
    //     }),
    //   )
    //   .subscribe(result => {
    //     this.notify.success(this.l('SavedSuccessfully'));
    //     abp.multiTenancy.setTenantIdCookie(result.tenantId);

    //     // 租户默认激活，并且登陆没有使用验证码，自动登陆
    //     if (result.isActive && !result.useCaptchaOnUserLogin) {
    //       this.saving = true;
    //       this._loginService.authenticateModel.userNameOrEmailAddress = this.model.adminEmailAddress;
    //       this._loginService.authenticateModel.password = this.model.tenantAdminPassword;
    //       this._loginService.authenticate(() => {
    //         this.saving = false;
    //       });
    //     } else {
    //       this.back();
    //     }
    //   });
  }
}
