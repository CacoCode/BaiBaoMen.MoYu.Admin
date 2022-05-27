import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { LayoutDefaultComponent } from '@layout/default/layout-default.component';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [AppRouteGuard],
    canActivateChild: [AppRouteGuard],
    children: [
      {
        path: 'main',
        loadChildren: 'app/main/main.module#MainModule', // Lazy load main module
        // data: { preload: true },
      },
      {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule', // Lazy load admin module
        // data: { preload: true },
      },
      {
        path: 'custom',
        loadChildren: 'app/adminCustom/custom.module#CustomModule', // Lazy load admin module
        // data: { preload: true },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: { titleI18n: 'Notifications', reuse: true }
      }
      // {
      //   path: '**',
      //   redirectTo: 'main',
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
