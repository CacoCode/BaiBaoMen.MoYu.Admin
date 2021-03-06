import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  RoleListDto,
  RoleServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { CreateOrEditRoleComponent } from '@app/admin/roles/create-or-edit-role/create-or-edit-role.component';
import { PermissionComboxComponent } from '@app/admin/shared/permission-combox/permission-combox.component';
import * as _ from 'lodash';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: [],
})
export class RolesComponent extends PagedListingComponentBase<RoleListDto> {

  advancedFiltersVisible = false; // 是否显示高级过滤

  /*
   * 选中的权限过滤
   */
  selectedPermission: string[] = [];

  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._roleService
      .getRoles(
        this.selectedPermission,
        this.filterText,
        request.sorting,
        request.maxResultCount,
        request.skipCount,
      )
      .finally(() => {
        finishedCallback();
      })
      .subscribe(result => {
        this.dataList = result.items;
        this.showPaging(result);
      });
  }

  protected exportDataList(
    request: PagedRequestDto,
    finishedCallback?: Function,
  ): void {
    this._roleService
      .getRolesToExcel(
        this.selectedPermission,
        this.filterText,
        request.sorting,
        request.maxResultCount,
        request.skipCount,
      )
      .finally(() => {
        if (finishedCallback != undefined && finishedCallback != null) {
          finishedCallback();
        }
      })
      .subscribe(result => {
        this.downExcelFile(result);
      });
  }

  /*
   * 强制刷新
   */
  forceRefresh() {
    this.filterText = '';
    this.refreshGoFirstPage();
  }
  /*
   * 删除功能
   * @param entity 角色的实体信息
   */
  protected delete(entity: RoleListDto): void {
    if (entity.isStatic) {
      abp.message.warn(
        this.l(
          'XUserCannotBeDeleted',
          AppConsts.userManagement.defaultAdminUserName,
        ),
      );
      return;
    }
    this._roleService.deleteRole(entity.id).subscribe(() => {
      this.refreshGoFirstPage();
      this.notify.success(this.l('SuccessfullyDeleted'));
    });
  }

  /*
   * 新增或编辑角色
   * @param id 当前角色Id
   */
  createOrEdit(id?: number): void {
    this.modalHelper
      .static(CreateOrEditRoleComponent, { id: id })
      .subscribe(res => {
        if (res) {
          this.refresh();
        }
      });
  }

  /*
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
          this._roleService.batchDelete(this.selectedDataItems).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
        }
      },
    );
  }
}
