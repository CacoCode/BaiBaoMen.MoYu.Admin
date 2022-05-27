import { Component, OnInit, Injector, NgZone } from '@angular/core';
import { NotificationServiceProxy } from '@shared/service-proxies/service-proxies';
import { UserNotificationHelper, IFormattedUserNotification } from '@shared/helpers/UserNotificationHelper';
import { AppComponentBase } from '@shared/component-base';
import { NotificationSettingsComponent } from '../notification-settings/notification-settings.component';
import { finalize } from 'rxjs/operators';

import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-header-notifications',
  templateUrl: './header-notifications.component.html',
  styleUrls: [
    './header-notifications.component.less'
  ]
})
export class HeaderNotificationsComponent extends AppComponentBase implements OnInit {

  notifications: IFormattedUserNotification[] = [];
  unreadNotificationCount = 0;
  loading: boolean;

  constructor(
    injector: Injector,
    private _notificationService: NotificationServiceProxy,
    private _userNotificationHelper: UserNotificationHelper,
    public _zone: NgZone
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.registerToEvents();
  }

  loadNotifications(): void {
    this.loading = true;
    // this._notificationService.getPagedUserNotificationsAsync(undefined, AppConsts.notificationCount, 0)
    //   .pipe(finalize(() => {
    //     this.loading = false;
    //   }))
    //   .subscribe(result => {
    //     this.unreadNotificationCount = result.unreadCount;
    //     this.notifications = [];
    //     result.items.forEach((item) => {
    //       this.notifications.push(this._userNotificationHelper.format(<any>item));
    //     });
    //   });
  }

  registerToEvents() {

    abp.event.on('abp.notifications.received', userNotification => {
      this._zone.run(() => {
        this._userNotificationHelper.show(userNotification);
        this.loadNotifications();
      });
    });

    abp.event.on('app.notifications.refresh', () => {
      this._zone.run(() => {
        this.loadNotifications();
      });
    });


    abp.event.on('app.notifications.read', userNotificationId => {
      this._zone.run(() => {
        for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].userNotificationId === userNotificationId) {
            this.notifications[i].state = 'READ';
          }
        }
        this.unreadNotificationCount -= 1;
      });
    });

  }

  setAllNotificationsAsRead(): void {
    // this._userNotificationHelper.setAllAsRead();
  }

  chantNotificationSettings(): void {
    this.modalHelper.create(NotificationSettingsComponent)
      .subscribe((res) => {

      });
  }

  setNotificationAsRead(userNotification: IFormattedUserNotification): void {
    // this._userNotificationHelper.setAsRead(userNotification.userNotificationId);
  }

  gotoUrl(url): void {
    if (url) {
      location.href = url;
    }
  }
}
