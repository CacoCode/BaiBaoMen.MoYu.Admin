import { Component, OnInit, Injector } from '@angular/core';
import { EditionServiceProxy, EditionListDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/component-base';
import { finalize } from 'rxjs/operators';
import { CreateOrEditEditionComponent } from './create-or-edit-edition/create-or-edit-edition.component';

@Component({
  selector: 'app-editions',
  templateUrl: './editions.component.html',
  styles: []
})
export class EditionsComponent extends PagedListingComponentBase<EditionListDto> implements OnInit {
  protected exportDataList(request: PagedRequestDto, finishedCallback: Function): void {
    throw new Error("Method not implemented.");
  }


  constructor(
    injector: Injector,
    private _editionService: EditionServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


  protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this._editionService.getEditions()
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        this.dataList = result.items;
      });
  }

  batchDelete() {
    this._editionService
      .batchDelete(this.selectedDataItems)
      .subscribe(() => this.refresh());
  }

  create() {
    this.modalHelper.static(CreateOrEditEditionComponent)
      .subscribe((res) => {
        if (res) {
          this.refresh();
        }
      });
  }

  edit(entityId: number) {
    this.modalHelper.static(CreateOrEditEditionComponent, {editionId: entityId})
      .subscribe((res) => {
        if (res) {
          this.refresh();
        }
      });
  }


  delete(entity: EditionListDto) {
    this.message.confirm(
      this.l('EditionDeleteWarningMessage', entity.displayName),
      this.l('MessageConfirmOperation'),
      isConfirmed => {
          if (isConfirmed) {
              this._editionService.deleteEdition(entity.id).subscribe(() => {
                  this.refresh();
                  this.notify.success(this.l('SuccessfullyDeleted'));
              });
          }
      }
  );
  }

  /**
 * ????????????
 */
  forceRefresh() {
    this.refreshGoFirstPage();
  }

}
