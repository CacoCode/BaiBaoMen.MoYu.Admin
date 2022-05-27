import { Component, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  TenantServiceProxy,
  TenantListDto,
  SubscribableEditionComboboxItemDto,
  EntityDtoOfInt64,
  NameValueDto,
  CommonLookupServiceProxy,
  FindUsersInput,
  SwitchEntityInputDtoOfInt32
} from '@shared/service-proxies/service-proxies';
import { CreateTenantComponent } from '@app/admin/tenants/create-tenant/create-tenant.component';
import { EditTenantComponent } from './edit-tenant/edit-tenant.component';
import { CommonLookupComponent } from '../common/common-lookup/common-lookup.component';
import { EditTenantFeaturesComponent } from './edit-tenant-features/edit-tenant-features.component';
import { ImpersonationService } from '@shared/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styles: [],
})
export class TenantsComponent extends PagedListingComponentBase<TenantListDto> {

  constructor(
    injector: Injector,
    private _activatedRoute: ActivatedRoute,
    private _tenantService: TenantServiceProxy,
    private _impersonationService: ImpersonationService,
    private _commonLookupService: CommonLookupServiceProxy,
  ) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  advancedFiltersVisible = false; // 是否显示高级过滤
  editionId: any = null; // 版本Id
  subscribableDateRange = [null, null]; // 订阅时间范围
  createDateRange = [null, null]; // 创建时间范围
  protected exportDataList(request: PagedRequestDto, finishedCallback: Function): void {
    throw new Error('Method not implemented.');
  }

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._tenantService
      .getTenants(
        this.filterText, // 名称过滤字符串
        this.advancedFiltersVisible ? this.subscribableDateRange[0] || undefined : undefined, // 订阅结束时间开始
        this.advancedFiltersVisible ? this.subscribableDateRange[1] || undefined : undefined, // 订阅结束时间结束
        this.advancedFiltersVisible ? this.createDateRange[0] || undefined : undefined, // 创建时间开始
        this.advancedFiltersVisible ? this.createDateRange[1] || undefined : undefined, // 创建时间结束
        this.editionId || undefined, // 版本id
        this.editionId !== null && (this.editionId + '') !== '-1',
        this.sorting, // 排序字段
        request.maxResultCount, // 最大数据量
        request.skipCount, // 跳过数据量
      )
      .finally(() => {
        finishedCallback();
      })
      .subscribe(result => {
        this.dataList = result.items;
        this.showPaging(result);
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
   * 解锁此租户默认管理员
   * @param entity
   */
  unlockTenantAdminUser(entity: TenantListDto): void {
    this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({ id: entity.id }))
      .subscribe(() => {
        this.notify.success(this.l('UnlockedTenandAdmin', entity.name));
      });
  }

  /*
   * update tenant features parameter
   * @param entity
   */
  changeTenantFeatures(entity: TenantListDto): void {
    this.modalHelper.createStatic(EditTenantFeaturesComponent, {
      tenantId: entity.id,
      tenantName: name
    }).subscribe((res) => {

    });
  }

  /*
   * use this tenant simulation sing in
   * @param entity
   */
  tenantImpersonateLogin(entity: TenantListDto): void {
    const input = new FindUsersInput();
    input.filter = 'admin';
    input.maxResultCount = 10;
    input.skipCount = 0;
    input.tenantId = entity.id;
    this._commonLookupService.findUsers(input).subscribe(result => {
      if (result.items.length === 0) {
        this.notify.error(this.l('UserImpersonateErrorMessage'));
        return;
      }

      this._impersonationService.impersonate(parseInt(result.items[0].value, null), input.tenantId);
    });
  }

  /*
  * update tenant info
  * @param entity
  */
  edit(entity: TenantListDto): void {
    this.modalHelper.static(EditTenantComponent, { entityId: entity })
      .subscribe((res) => {
        if (res) {
          this.refresh();
        }
      });
  }

  /*
   * delete tenant info
   * @param {TenantListDto} entity
   */
  delete(entity: TenantListDto): void {
    this._tenantService
      .deleteTenant(entity.id)
      .subscribe(() => this.refresh());
  }

  /*
   * create tenant info
   */
  create(): void {
    this.modalHelper.open(CreateTenantComponent, null, 'md').subscribe(res => {
      if (res) {
        this.refresh();
      }
    });
  }

  /*
   * batch delete tenants
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
          this._tenantService.batchDelete(this.selectedDataItems).subscribe(() => {
            this.refresh();
            this.notify.success(this.l('SuccessfullyDeleted'));
          });
        }
      },
    );
  }

  /*
   * edition option changed callback
   * @param {SubscribableEditionComboboxItemDto} edition
   */
  selectedEditionChange(edition: SubscribableEditionComboboxItemDto) {
    this.editionId = edition ? edition.value : null;
    this.refresh();
  }

  /*
   * update isActive state callback
   * @param {TenantListDto} item
   */
  updateIsActiveonChange(item: TenantListDto) {
      
  }

  impersonateUser(item: NameValueDto, id: number): void {
    this._impersonationService
      .impersonate(
        parseInt(item[0].value, id),
        id
      );
  }
}
