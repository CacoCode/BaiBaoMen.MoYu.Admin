import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderI18nComponent } from './default/header/components/i18n.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { ChangePasswordModalComponent } from './default/profile/change-password-modal.component';
import { LoginAttemptsModalComponent } from './default/profile/login-attempts-modal.component';
import { MySettingsModalComponent } from './default/profile/my-settings-modal.component';
import { LayoutDefaultComponent } from './default/layout-default.component';
import { MagicodesSidebarNavComponent } from './default/sidebar/components/magicodes-sidebar-nav.component';
import { NotificationSettingsComponent } from './default/header/components/notification-settings/notification-settings.component';
import { HeaderNotificationsComponent } from './default/header/components/header-notifications/header-notifications.component';
import { UserNotificationHelper } from '@shared/helpers/UserNotificationHelper';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  LayoutDefaultComponent
];

const HEADERCOMPONENTS = [
  HeaderFullScreenComponent,
  HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  NotificationSettingsComponent,
  HeaderNotificationsComponent,
];

// passport
const ABPCOMPONENTS = [
  ChangePasswordModalComponent,
  LoginAttemptsModalComponent,
  MySettingsModalComponent,
  NotificationSettingsComponent,
];
//
const SIDEBARCOMPONENTS = [
  MagicodesSidebarNavComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgZorroAntdModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...ABPCOMPONENTS,
    ...SIDEBARCOMPONENTS,
  ],
  entryComponents: [
    ...ABPCOMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ],
  providers: [
    UserNotificationHelper
  ]
})
export class LayoutModule { }
