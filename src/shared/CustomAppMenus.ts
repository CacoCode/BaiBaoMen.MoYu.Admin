import { AppConsts } from '@shared/AppConsts';
import { Menu } from '@delon/theme';

export class CustomAppMenus {
  static Menus: Menu[] = [
    
    {
      // 订单管理
      text: '',
      i18n: '微信用户',
      acl: 'Customs.WxUser',
      icon: {
        type: 'icon',
        value: 'order',
        theme: 'fill'
      },
      link: '/app/custom/wxUser',
    }
  ];
}
