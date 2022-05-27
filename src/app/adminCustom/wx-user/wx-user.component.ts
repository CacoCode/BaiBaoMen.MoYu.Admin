import { Component, Injector } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base/paged-listing-component-base';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EntityDtoOfGuid } from '@shared/service-proxies/service-proxies';
import { WxUserListDto, WxUserServiceProxy } from '@shared/service-proxies/custom-service-proxies';

@Component({
  selector: 'app-wx-user',
  templateUrl: './wx-user.component.html',
  styles: [`
    /deep/ .ant-input-affix-wrapper .ant-input-suffix{
        right: 0px;
    }
    `]
})
export class WxUserComponent extends PagedListingComponentBase<WxUserListDto> {

  mapOfExpandData: { [key: string]: boolean } = {};
  gridStyle = {
    width: '25%',
    height:'250px',
    textAlign: 'center'
  };

  constructor(injector: Injector,
    private _wxUserService: WxUserServiceProxy,
    private _modalService: NzModalService) {
    super(injector);
  }

  fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._wxUserService.getAll(
      this.filterText,
      request.sorting,
      request.maxResultCount,
      request.skipCount,
    ).finally(() => {
      finishedCallback();
    }).subscribe(result => {
      this.dataList = result.items;
      this.showPaging(result);
    });
  }

  protected exportDataList(
    request: PagedRequestDto,
    finishedCallback?: Function,
  ): void {
    this._wxUserService
      .getExport(
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

  createOrEdit(item: WxUserListDto): void {
    console.log(111);
    // this.modalHelper
    //     .static(CreateOrEditEquipmentComponent, { item: item })
    //     .subscribe(res => {
    //         if (res) {
    //             this.refresh();
    //         }
    //     });
  }


}
