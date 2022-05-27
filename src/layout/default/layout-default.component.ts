import {
  Component,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Inject,
  Injector,
  NgZone,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { NzMessageService, NzIconService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { updateHostClass } from '@delon/util';
import { ScrollService, MenuService, SettingsService } from '@delon/theme';

// #region icons

import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  SearchOutline,
  SettingOutline,
  FullscreenOutline,
  FullscreenExitOutline,
  BellOutline,
  LockOutline,
  PlusOutline,
  UserOutline,
  LogoutOutline,
  EllipsisOutline,
  GlobalOutline,
  ArrowDownOutline,
  // Optional
  GithubOutline,
  AppstoreOutline,
} from '@ant-design/icons-angular/icons';

const ICONS = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  SearchOutline,
  SettingOutline,
  FullscreenOutline,
  FullscreenExitOutline,
  BellOutline,
  LockOutline,
  PlusOutline,
  UserOutline,
  LogoutOutline,
  EllipsisOutline,
  GlobalOutline,
  ArrowDownOutline,
  // Optional
  GithubOutline,
  AppstoreOutline,
];

// #endregion

import { environment } from '@env/environment';
import { AppComponentBase } from '@shared/component-base';
import { AppMenus } from '@shared/AppMenus';
import { CustomAppMenus } from '@shared/CustomAppMenus';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';


@Component({
  selector: 'layout-default',
  templateUrl: './layout-default.component.html',
  preserveWhitespaces: false,
  host: {
    '[class.alain-default]': 'true',
  },
})
export class LayoutDefaultComponent extends AppComponentBase
  implements OnInit, AfterViewInit, OnDestroy {
  private notify$: Subscription;
  isFetching = false;

  constructor(
    injector: Injector,
    iconSrv: NzIconService,
    router: Router,
    scroll: ScrollService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private doc: any,
    private _zone: NgZone
  ) {
    super(injector);
    iconSrv.addIcon(...ICONS);
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          this.message.error(`无法加载${evt.url}路由`);
        }
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });

    const menus = AppMenus.Menus.concat(CustomAppMenus.Menus);
    this.menuSrv.add(menus);
  }

  get collapsed(): boolean {
    return this.settings.layout.collapsed;
  }

  private setClass() {
    const { el, renderer, settings } = this;
    const layout = settings.layout;

    updateHostClass(
      el.nativeElement,
      renderer,
      {
        ['alain-default']: true,
        // [`alain-default__fixed`]: layout.fixed,
        [`alain-default__boxed`]: layout.boxed,
        [`alain-default__collapsed`]: layout.collapsed,
      },
      true,
    );

    this.doc.body.classList[layout.colorWeak ? 'add' : 'remove']('color-weak');
  }



  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.notify$ = this.settings.notify.subscribe(() => this.setClass());
    this.setClass();

    // 初始化SignalR连接
    // this.initiSignalR();
  }

  ngOnDestroy() {
    this.notify$.unsubscribe();
  }

  initiSignalR() {
    // 连接到signalR
    SignalRAspNetCoreHelper.initSignalR(() => {

    });
  }
}
