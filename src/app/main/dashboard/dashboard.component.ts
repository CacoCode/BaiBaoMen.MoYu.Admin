import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AdvertisingComponent } from '../advertising/advertising.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],

  animations: [appModuleAnimation()],
})
export class DashboardComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
    private http: _HttpClient,
    public msg: NzMessageService,
  ) {
    super(injector);
  }

  members = [
    {
      id: 'members-1',
      title: '简书',
      logo:
        'https://cdn2.jianshu.io/assets/web/nav-logo-4c7bbafe27adc892f3046e6978459bac.png',
      link: 'https://www.jianshu.com/u/472dd8203a81',
    },
    {
      id: 'members-2',
      title: 'CSDN',
      logo: 'https://csdnimg.cn/cdn/content-toolbar/spring-logo.png',
      link: 'https://me.csdn.net/qq512982554',
    },
    {
      id: 'members-5',
      title: 'github源代码',
      logo: 'https://major.io/wp-content/uploads/2014/08/github.png',
      link: 'https://github.com/xin-lai',
    },
    {
      id: 'members-4',
      title: '博客园-博文地址',
      logo: 'https://www.cnblogs.com/images/logo_small.gif',
      link: 'https://www.cnblogs.com/codelove/',
    },
    {
      id: 'members-5',
      title: '码云',
      logo: 'https://gitee.com/logo-black.svg?20171024',
      link: 'https://gitee.com/magicodes',
    },
    {
      id: 'members-6',
      title: '微信公众号：Magiccodes',
        logo: 'https://images.gitee.com/uploads/group/241434814461645.png',
      link:
        'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0Mzk1OTU2Mg==&scene=126&bizpsid=0#wechat_redirect',
    },
  ];

  notice: any[] = [
    {
      logo: 'https://docs.microsoft.com/zh-cn/dotnet/images/hub/netcore.svg',
      title: '.NET Core',
      href: 'https://dotnet.github.io/',
      description:
        '.NET CORE 是微软新一代的跨平台的框架， 是.NET Framework的进化版本,.NET Core的核心点： 创新、开源、跨平台，当前版本为.net core2.x',
    },
    {
      logo: 'https://aspnetboilerplate.com/images/logos/abp-logo-long.png',
      title: 'ABP',
      href: 'https://aspnetboilerplate.com/',
      description:
        'ASP.NET Boilerplate是一个用最佳实践和流行技术开发现代WEB应用程序的新起点，它旨在成为一个通用的WEB应用程序框架和项目模板框架',
    },
    {
      logo: 'https://ng.ant.design/assets/img/logo.svg',
      title: 'NG-ZORRO',
      href: 'https://ng.ant.design',
      description:
        '这里是 Ant Design 的 Angular 实现，开发和服务于企业级后台产品。也是52ABP框架的前端核心之一',
    },
    {
      logo: 'https://ng-alain.com/assets/img/logo-color.svg',
      title: 'NG Alain',
      href: 'https://ng-alain.com/',
      description:
        '一个基于 Antd的设计，整合了NG-ZORRO的 中后台前端解决方案，提供更多通用性业务模块，让开发者更加专注于业务。',
    },
    {
      logo:
        'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      title: 'Angular',
      href: 'https://aspnetboilerplate.com/',
      description:
        'Angular 是一个开发平台。它能帮你更轻松的构建 Web 应用。Angular 集声明式模板、依赖注入、端到端工具和一些最佳实践于一身，为你解决开发方面的各种...',
    },
  ];
  loading = false;

  ngOnInit(): void {

  }

  showAdvertising() {
    this.modalHelper.open(AdvertisingComponent)
      .subscribe(() => {

      });
  }
}
