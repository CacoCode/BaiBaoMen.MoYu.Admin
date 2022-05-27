import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  UserListDto,
  UserServiceProxy,
  EntityDtoOfInt64,
  PagedResultDtoOfUserListDto,
} from '@shared/service-proxies/service-proxies';
import { CreateOrEditUserComponent } from '@app/admin/users/create-or-edit-user/create-or-edit-user.component';
import { EditUserPermissionsComponent } from '@app/admin/users/edit-user-permissions/edit-user-permissions.component';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppConsts } from '@shared/AppConsts';
import { ImpersonationService } from '@shared/auth';
import { FileDownloadService } from '@shared/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
})
export class UsersComponent extends PagedListingComponentBase<UserListDto>
  implements OnInit {

    filterText = ''; // 模糊搜索
    advancedFiltersVisible = false; // 是否显示高级过滤
    selectedPermission: string[] = []; // 选中的权限过滤
    isActive: boolean = undefined; // 是否激活过滤
    isEmailConfirmed: boolean = undefined; // 是否已验证邮箱过滤
    role: number[] = []; // 选中的角色Ids过滤

  protected exportDataList(request: PagedRequestDto, finishedCallback?: Function): void {
    throw new Error('Method not implemented.');
  }
  /*
   * 是否显示解锁按钮
   */
  get enabledUnlock(): boolean {
    return this.isGranted('Pages.Administration.Users.Edit') && this.setting.getBoolean('Abp.Zero.UserManagement.UserLockOut.IsEnabled');
  }
  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _activatedRoute: ActivatedRoute,
    public _impersonationService: ImpersonationService,
    private _fileDownloadService: FileDownloadService
  ) {
    super(injector);
    this.filterText =
      this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  // 搜索
  onSearch(): void {
    this.refresh();
  }

  /*
   * 激活过滤
   * @param event 值
   */
  isActiveFilter(event: any): void {
    if (event === null || event === 'All') {
      this.isActive = undefined;
    } else {
      this.isActive = event;
    }
    this.refreshGoFirstPage();
  }

  /*
   * 邮件确认过滤
   * @param event 值
   */
  isEmailConfirmedFilter(event: any): void {
    if (event === null || event === 'All') {
      this.isEmailConfirmed = undefined;
    } else {
      this.isEmailConfirmed = event;
    }
    this.refreshGoFirstPage();
  }

  /*
   * 根据角色列表进行数据展示
   * @param roles 角色列表信息
   */
  getRolesAsString(roles): string {
    let roleNames = '';
    for (let j = 0; j < roles.length; j++) {
      if (roleNames.length) {
        roleNames = roleNames + ', ';
      }
      roleNames = roleNames + roles[j].roleName;
    }
    return roleNames;
  }

  /*
   * 添加或者编辑实体信息模态框
   * @param id 需要修改实体信息的ID
   */
  createOrEdit(id?: number): void {
    this.modalHelper
      .static(CreateOrEditUserComponent, { id: id })
      .subscribe(res => {
        if (res) {
          this.refresh();
        }
      });
  }

  editUserPermissions(user: UserListDto): void {
    this.modalHelper
      .open(EditUserPermissionsComponent, {
        userId: user.id,
        userName: user.userName,
      })
      .subscribe(result => { });
  }

  unlockUser(user: UserListDto): void {
    const data = new EntityDtoOfInt64();
    data.id = user.id;
    // this._userService
    //   // .unlock(data)
    //   // .finally(() => { })
    //   .subscribe(() => {
    //     this.refresh();
    //     this.notify.success(this.l('SuccessfullyUnlock'));
    //   });
  }

  /*
   * 强制刷新
   */
  forceRefresh() {
    this.filterText = '';
    this.isEmailConfirmed = undefined;
    this.isActive = undefined;
    this.selectedPermission = undefined;
    this.role = undefined;
    this.refreshGoFirstPage();
  }

  /*
   * 获取远端数据
   * @param request
   * @param pageNumber
   * @param finishedCallback
   */
  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._userService
      .getUsers(
        this.filterText,
        this.selectedPermission,
        this.role,
        request.sorting,
        request.maxResultCount,
        request.skipCount,
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe((result: PagedResultDtoOfUserListDto) => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  /**
   * 批量删除
   */
  batchDelete(): void {
    const selectCount = this.selectedDataItems.length;
    if (selectCount <= 0) {
      abp.message.warn(this.l('PleaseSelectAtLeastOneItem'));
      return;
    }
    this.message.confirm(
      this.l('ConfirmDeleteXItemsWarningMessage', selectCount),
      this.l('ConfirmInformation'),
      res => {
        if (res) {
          this._userService.batchDelete(this.selectedDataItems).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
        }
      },
    );
  }

  exportToExcel(): void {

    this._userService.getUsersToExcel().subscribe(result => {
      this._fileDownloadService.downloadTempFile(result);
    });
    // 调用后端的到处方法
  }
  /*
   * 删除功能
   * @param entity 实体信息：User
   */
  protected delete(entity: UserListDto): void {
    if (entity.userName === AppConsts.userManagement.defaultAdminUserName) {
      abp.message.warn(
        this.l(
          'XUserCannotBeDeleted',
          AppConsts.userManagement.defaultAdminUserName,
        ),
      );
      return;
    }

    this._userService.deleteUser(entity.id).subscribe(() => {
      this.refreshGoFirstPage();
      this.notify.success(this.l('SuccessfullyDeleted'));
    });
  }


  isAdmin(item: UserListDto): boolean {
    return item.userName === AppConsts.userManagement.defaultAdminUserName;
  }

  refreshCheckStatus(entityList: any[]): void {
    entityList.forEach(item => {
      if (item.userName === AppConsts.userManagement.defaultAdminUserName) {
        item.checked = false;
      }
    });

    // 是否全部选中
    const allChecked = entityList.every(value => value.checked === true);
    // 是否全部未选中
    const allUnChecked = entityList.every(value => !value.checked);
    // 是否全选
    this.allChecked = allChecked;
    // 全选框样式控制
    this.checkboxIndeterminate = !allChecked && !allUnChecked;
    // 已选中数据
    this.selectedDataItems = entityList.filter(value => value.checked);
  }
}
