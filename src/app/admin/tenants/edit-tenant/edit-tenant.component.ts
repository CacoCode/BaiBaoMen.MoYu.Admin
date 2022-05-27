import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { Component, OnInit, Injector, Input } from '@angular/core';
import { TenantServiceProxy, TenantEditDto, SubscribableEditionComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-edit-tenant',
  templateUrl: './edit-tenant.component.html',
  styles: []
})
export class EditTenantComponent extends ModalComponentBase implements OnInit {

  @Input()
  entityId: number;
  entity: TenantEditDto = new TenantEditDto();
  isUnlimited: boolean;
  connectionString: string;
  edition: SubscribableEditionComboboxItemDto;
  subscriptionEndUtc: any;


  constructor(
    injector: Injector,
    private _tenantService: TenantServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.saving = true;

    this._tenantService.getTenantForEdit(this.entityId)
      .pipe(finalize(() => {
        this.saving = false;
      })).subscribe((result) => {
        this.entity = result;
        this.subscriptionEndUtc = this.entity.subscriptionEndDateUtc ? this.entity.subscriptionEndDateUtc.toDate() : null;
        this.connectionString = this.entity.connectionString;
        this.isUnlimited = !this.entity.subscriptionEndDateUtc;
      });
  }

  save() {
    this.saving = true;

    // 版本
    this.entity.editionId = this.edition ? +this.edition.value : null;
    // 如果没有选择版本或勾选了无限期使用，订阅时间设置为null
    this.entity.subscriptionEndDateUtc = (!this.entity.editionId || this.isUnlimited) ? null : this.subscriptionEndUtc;

    this._tenantService.updateTenant(this.entity)
      .pipe(finalize(() => {
        this.saving = false;
      })).subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.success();
      });
  }

  selectedEditionChange(edtion: SubscribableEditionComboboxItemDto) {
    this.edition = edtion;
  }
}
