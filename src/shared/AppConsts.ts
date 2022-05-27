import { state } from '@angular/animations';
import {
  NzModalService,
  NzNotificationService,
  NzNotificationDataOptions,
  NzMessageService,
} from 'ng-zorro-antd';
import { parse } from 'date-fns';

export class AppConsts {
  static remoteServiceBaseUrl: string;
  

  static appBaseUrl: string;
  static uploadApiUrl = '/api/File/Upload';
  static maxProfilPictureMb = 1; // 个人头像上传最大MB
  /**
   * 后端本地化和前端angular本地化映射
   */
  static localeMappings: any;
  /**
   * 后端本地化和ng-zorro本地化映射
   */
  static ngZorroLocaleMappings: any;
  /**
   * 后端本地化和ng-alian本地化映射
   */
  static ngAlainLocaleMappings: any;
  /**
  * 后端本地化和moment.js本地化映射
  */
  static momentLocaleMappings: any;

  static readonly userManagement = {
    defaultAdminUserName: 'admin',
  };

  static readonly localization = {
    defaultLocalizationSourceName: 'Admin',
  };

  static readonly authorization = {
    encrptedAuthTokenName: 'enc_auth_token',
  };

  /**
   * 数据表格设置
   */
  // tslint:disable-next-line:member-ordering
  static readonly grid = {
    /**
     * 每页显示条目数
     */
    defaultPageSize: 10,
    /**
     * 每页显示条目数下拉框值
     */
    defaultPageSizes: [5, 10, 15, 20, 25, 30, 50, 80, 100],
  };

  /**
   * top bar通知组件中获取通知数量
   */
  static readonly notificationCount = 5;

  /*
   * 重构添加
   */
  static readonly tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';

  static appBaseUrlFormat: string;

  static remoteServiceBaseUrlFormat: string;

  static recaptchaSiteKey: string;

  static subscriptionExpireNootifyDayCount: number;
/*
* returns angular's base-href parameter value if used during the publish
*/
  static appBaseHref: string;
}
