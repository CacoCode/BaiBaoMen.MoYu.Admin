import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { AbpModule } from '@abp/abp.module';

import { CustomRoutingModule } from '@app/adminCustom/custom-routing.module';
import { UploadFileComponent } from '@app/components/upload-file/upload-file.component';
import { MultipleUploadFileComponent } from '@app/components/multiple-upload-file/multiple-upload-file.component';
import { AppSharedModule } from '@appshared/app-shared.module';

import { WxUserComponent } from './wx-user/wx-user.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    AbpModule,
    CustomRoutingModule,
    AppSharedModule,
  ],
  declarations: [
    UploadFileComponent,
    MultipleUploadFileComponent,
    WxUserComponent,
   
  ],
  providers: [
  ],
  entryComponents: [
    // CreateOrEditEquipmentComponent
  ],
})
export class CustomModule { }
