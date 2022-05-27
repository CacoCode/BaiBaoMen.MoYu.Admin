import { AppComponentBase } from '@shared/component-base/app-component-base';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { ChangePasswordModalComponent } from '@layout/default/profile/change-password-modal.component';
import { LoginAttemptsModalComponent } from '@layout/default/profile/login-attempts-modal.component';
import { MySettingsModalComponent } from '@layout/default/profile/my-settings-modal.component';
import { ImpersonationService } from '@shared/auth';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="'/assets/images/user.png'" nzSize="small" class="mr-sm"></nz-avatar>
      {{loginUserName}}
    </div>
    <div nz-menu class="width-sm">
      <!-- 返回我的账户 -->
      <div nz-menu-item (click)="backToMyAccount()" *ngIf="isImpersonatedLogin">
        <i class="anticon anticon-rollback mr-sm"></i>
        {{l("BackToMyAccount")}}
     </div>
      <!-- 密码修改 -->
      <div nz-menu-item (click)="changePassword()">
        <i class="anticon anticon-ellipsis mr-sm"></i>
        {{l("ChangePassword")}}
      </div>
      <!-- 登陆记录 -->
      <div nz-menu-item (click)="showLoginAttempts()">
        <i class="anticon anticon-bars mr-sm"></i>
        {{l("LoginAttempts")}}
      </div>
      <!-- 设置 -->
      <div nz-menu-item (click)="changeMySettings()">
        <i class="anticon anticon-setting mr-sm"></i>
        {{l("MySettings")}}
      </div>
      <li nz-menu-divider></li>
      <!-- 注销 -->
      <div nz-menu-item (click)="logout()">
        <i class="anticon anticon-logout mr-sm"></i>
        {{l('Logout')}}
      </div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent extends AppComponentBase implements OnInit {


  loginUserName: string;
  isImpersonatedLogin: boolean;

  constructor(injector: Injector,
    private authService: AppAuthService,
    private impersonationService: ImpersonationService,
  ) {
    super(injector);
  }
  
  ngOnInit(): void {
    this.isImpersonatedLogin = this.abpSession.impersonatorUserId > 0;
    this.loginUserName = this.appSession.getShownLoginName();
  }

  changePassword(): void {
    this.modalHelper.open(ChangePasswordModalComponent).subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }

  showLoginAttempts(): void {
    this.modalHelper.open(LoginAttemptsModalComponent).subscribe(result => { });
  }

  changeMySettings(): void {
    this.modalHelper.open(MySettingsModalComponent).subscribe(result => { });
  }


  backToMyAccount(): void {

    this.impersonationService.backToImpersonator();
  }
  logout(): void {
    this.authService.logout();
  }
}
