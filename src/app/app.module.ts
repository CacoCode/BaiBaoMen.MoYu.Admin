import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '@app/app-routing.module';

import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { AbpModule } from '@abp/abp.module';
import { LayoutModule } from '@layout/layout.module';
import { ImpersonationService } from '@shared/auth';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserNotificationHelper } from '@shared/helpers/UserNotificationHelper';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutModule,
    SharedModule,
    AbpModule,
  ],
  declarations: [
    NotificationsComponent,
  ],
  entryComponents: [

  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    ImpersonationService,
    UserNotificationHelper,
  ]
})
export class AppModule { }
