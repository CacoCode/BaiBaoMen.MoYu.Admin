import { finalize } from 'rxjs/operators';
import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import {
  RoleEditDto,
  PermissionServiceProxy,
  RoleServiceProxy,
  CreateOrUpdateRoleInput,
  UserEditDto,
} from '@shared/service-proxies/service-proxies';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree/permission-tree.component';

import { ModalComponentBase } from '@shared/component-base/modal-component-base';

@Component({
  selector: 'app-create-or-edit-role',
  templateUrl: './create-or-edit-role.component.html',
  styles: [],
})
export class CreateOrEditRoleComponent extends ModalComponentBase
  implements OnInit {
  @ViewChild('permissionTree', { read: '', static: false })
  permissionTree: PermissionTreeComponent;

  /*
   * 编辑时Id
   */
  id?: number;
  /*
   * 用户实体
   */
  user: UserEditDto = new UserEditDto();
  /*
   * 角色实体
   */
  role: RoleEditDto = new RoleEditDto();
  constructor(injector: Injector, private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    // 初始化数据
    this.init();
  }
  /*
   * 初始化
   */
  init(): void {
    this._roleService.getRoleForEdit(this.id).subscribe(result => {
      this.role = result.role;
      this.permissionTree.editData = result;
    });
  }

  /*
   * 提交 实行的方法
   * @param finisheCallback 回调
   */
  save(): void {
    this.saving = true;
    const input: CreateOrUpdateRoleInput = new CreateOrUpdateRoleInput();
    input.role = this.role;
    input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
    this.saving = true;
    this._roleService
      .createOrUpdateRole(input)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.success();
      });
  }
}
