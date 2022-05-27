import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WxUserComponent } from './wx-user/wx-user.component';
const routes: Routes = [
  { path: 'wxUser', component: WxUserComponent, data: { titleI18n: '微信用户' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomRoutingModule { }
