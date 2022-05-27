import { Component, OnInit, Injector, Input } from '@angular/core';
import {
  OrganizationUnitServiceProxy,
  CreateOrganizationUnitInput,
  UpdateOrganizationUnitInput,
  OrganizationUnitDto
} from '@shared/service-proxies/service-proxies';
import { Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';

export interface IOrganizationUnitOnEdit {
  id?: number;
  parentId?: number;
  displayName?: string;
  parentDisplayName?: string;
}

@Component({
  selector: 'app-create-or-edit-organiaztion-unit',
  templateUrl: './create-or-edit-organiaztion-unit.component.html',
  styles: [],
})
export class CreateOrEditOrganiaztionUnitComponent extends ModalComponentBase
  implements OnInit {
  @Input()
  organizationUnit: IOrganizationUnitOnEdit = {};

  constructor(
    injector: Injector,
    private organizationUnitService: OrganizationUnitServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {}

  /*
  *保存组织机构
  */
  save(): void {
    if (this.organizationUnit.id) {
      // 修改
      this.updateUnit();
    } else {
      // 创建
      this.createUnit();
    }
  }

  /*
  *编辑组织机构
  */
  updateUnit(): any {
    const updateInput = new UpdateOrganizationUnitInput();
    updateInput.id = this.organizationUnit.id;
    updateInput.displayName = this.organizationUnit.displayName;
    this.saving = true;
    this.organizationUnitService
      .updateOrganizationUnit(updateInput)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(result => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.success(result);
      });
  }
  /*
  *创建组织机构
  */
  createUnit(): any {
    const input = new CreateOrganizationUnitInput();
    input.parentId = this.organizationUnit.parentId;
    input.displayName = this.organizationUnit.displayName;
    this.saving = true;

    this.organizationUnitService
      .createOrganizationUnit(input)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((result: OrganizationUnitDto) => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.success(result);
      });
  }
}
