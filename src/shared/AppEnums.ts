import { IsTenantAvailableOutputState, DefaultTimezoneScope, UserNotificationState } from '@shared/service-proxies/service-proxies';

export class AppTenantAvailabilityState {
  static Available: number = IsTenantAvailableOutputState._1;
  static InActive: number = IsTenantAvailableOutputState._2;
  static NotFound: number = IsTenantAvailableOutputState._3;
}



export class AppTimezoneScope {
  static Application: number = DefaultTimezoneScope._1;
  static Tenant: number = DefaultTimezoneScope._2;
  static User: number = DefaultTimezoneScope._4;
}

/**
 * 验证码类型
 */
export class AppCaptchaType {
  /**
   * 宿主租户注册
   */
  static readonly HostTenantRegister = 1;
  /**
   * 宿主用户登陆
   */
  static readonly HostUserLogin = 2;
  /**
   * 租户用户注册
   */
  static readonly TenantUserRegister = 3;
  /**
   * 租户用户登陆
   */
  static readonly TenantUserLogin = 4;
}

export class AppEditionExpireAction {
  static DeactiveTenant = 'DeactiveTenant';
  static AssignToAnotherEdition = 'AssignToAnotherEdition';
}

/**
 * 用户通知状态
 */
export class AppUserNotificationState {
  /**
   * 未读
   */
  static Unread: number = UserNotificationState._0;
  /**
   * 已读
   */
  static Read: number = UserNotificationState._1;
}

