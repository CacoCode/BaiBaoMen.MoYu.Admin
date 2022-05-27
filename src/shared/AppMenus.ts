import { AppConsts } from '@shared/AppConsts';
import { Menu } from '@delon/theme';

/**
 * 全局的左侧边栏的菜单导航配置信息
 */
export class AppMenus {
  static Menus: Menu[] = [
    {// 工作台
      text: '',
      i18n: 'Dashboard',
      acl: undefined,
      icon: 'anticon anticon-dashboard',
      link: '/app/main/dashboard',
    },
    {// 管理
      text: '',
      i18n: 'Administration',
      acl: 'Pages',
      icon: 'anticon anticon-appstore',
      children: [

        {// 角色
          text: '',
          i18n: 'Roles',
          acl: 'Pages.Administration.Roles',
          icon: 'anticon anticon-safety',
          link: '/app/admin/roles',
        },
        {// 用户
          text: '',
          i18n: 'Users',
          acl: 'Pages.Administration.Users',
          icon: 'anticon anticon-user',
          link: '/app/admin/users',
        }
      ]
    }
  ];
}
