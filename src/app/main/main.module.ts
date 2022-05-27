import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';

import { AbpModule } from '@abp/abp.module';
import { AdvertisingComponent } from './advertising/advertising.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MainRoutingModule,
    SharedModule,
    AbpModule,
  ],
  declarations: [
    DashboardComponent,
    AdvertisingComponent,
  ],
  entryComponents: [
    AdvertisingComponent
  ],
  providers: [

  ],
})
export class MainModule {
}
