import {
  Component,
  OnInit,
  Injector,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { FormControl, AbstractControl, Validators } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';

import * as _ from 'lodash';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
// tslint:disable-next-line:max-line-length
import {
  IOrganizationUnitsTreeComponentData,
  OrganizationUnitsTreeComponent,
} from '@app/admin/shared/organization-unit-tree/organization-unit-tree.component';
import {
  UserRoleDto,
  // OrganizationUnitListDto,
  UserEditDto,
  RoleServiceProxy,
  UserServiceProxy,
  CreateOrUpdateUserInput,
  ProfileServiceProxy,

  OrganizationUnitDto,
} from '@shared/service-proxies/service-proxies';
import { UploadFile } from 'ng-zorro-antd';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '@abp/auth/token.service';

@Component({
  selector: 'app-create-or-edit-user',
  templateUrl: './create-or-edit-user.component.html',
  styleUrls: ['./create-or-edit-user.component.less'],
})
export class CreateOrEditUserComponent extends ModalComponentBase
  implements OnInit, AfterViewInit {
  @ViewChild('organizationUnitTree', { read: '', static: false })
  organizationUnitTree: OrganizationUnitsTreeComponent;

  /*
   * 修改时用户Id
   */
  id?: number;
  /*
   * 发送激活邮件
   */
  sendActivationEmail = false;
  /*
   * 角色数据列表
   */
  roles: UserRoleDto[];
  /**
   * 所有机构数据
   */
  allOrganizationUnits: OrganizationUnitDto[];
  /*
   * 随机密码
   */
  setRandomPassword = false;
  /*
   * 当前用户所属机构代码列表
   */
  memberedOrganizationUnits: string[];
  /*
   * 是否启用双重因素身份验证
   */
  isTwoFactorEnabled: boolean = this.setting.getBoolean(
    'Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled',
  );
  /*
   * 是否启用锁定
   */
  isLockoutEnabled: boolean = this.setting.getBoolean(
    'Abp.Zero.UserManagement.UserLockOut.IsEnabled',
  );
  /*
  *用户实体信息
  */
  user: UserEditDto = new UserEditDto();
  /*
   * 是否为管理员
   */
  isAdmin = false;
  //#region 头像功能
  /*
   * 图片最大大小 M
   */
  private maxProfilPictureBytesValue = AppConsts.maxProfilPictureMb;
  /*
   * 图片上传后台处理地址
   */
  public uploadPictureUrl: string =
    AppConsts.remoteServiceBaseUrl +
    '/Profile/UploadProfilePictureReturnFileId';
  /*
   * 头像列表
   */
  profileList: any[] = [];
  /*
   * 编辑时加载图像
   */
  profileLoading = false;
  /*
   * 头像预览地址
   */
  profilePreviewImage = '';
  /*
   * 预览头像Modal控制
   */
  profilePreviewVisible = false;
  /*
   * 上传控件头部信息
   */
  public uploadHeaders: any;

  passwordRepeatStr: string;

  //#endregion
  constructor(
    injector: Injector,
    private _profileService: ProfileServiceProxy,
    private _userService: UserServiceProxy,
    private _tokenService: TokenService,
  ) {
    super(injector);
    // 设置头部信息
    this.uploadHeaders = {
      Authorization: 'Bearer ' + this._tokenService.getToken(),
    };
  }

  ngOnInit(): void {
    if (!this.id) {
      this.setRandomPassword = true;
      this.sendActivationEmail = false;
    }
    // 初始化数据
    this.init();
  }
  ngAfterViewInit(): void { }
  /*
   * 获取数据
   */
  init(): void {
    this._userService.getUserForEdit(this.id).subscribe(result => {
      this.user = result.user;
      // 是否为管理员
      this.isAdmin =
        result.user.userName === AppConsts.userManagement.defaultAdminUserName;
      // 角色
      this.roles = result.roles;
      // 组织机构树
      this.allOrganizationUnits = result.allOrganizationUnits;
      this.memberedOrganizationUnits = result.memberedOrganizationUnits;

      this.getProfilePicture(result.profilePictureId);
      if (this.id) {
        setTimeout(() => {
          this.setRandomPassword = false;
        }, 0);
        this.sendActivationEmail = false;
      }
      // 设置组织机构树
      this.setOrganizationUnitTreeData();
    });
  }

  setOrganizationUnitTreeData(): any {
    this.organizationUnitTree.data = <IOrganizationUnitsTreeComponentData>{
      allOrganizationUnits: this.allOrganizationUnits,
      selectedOrganizationUnits: this.memberedOrganizationUnits,
    };
  }

  // 提交保存信息
  save(): void {
    const input = new CreateOrUpdateUserInput();
    input.user = this.user;
    input.user.name = this.user.userName;
    input.user.surname = this.user.userName;
    input.setRandomPassword = this.setRandomPassword;
    input.sendActivationEmail = this.sendActivationEmail;
    input.assignedRoleNames = _.map(
      _.filter(this.roles, { isAssigned: true }),
      role => role.roleName,
    );
    // 组织机构
    input.organizationUnits = this.organizationUnitTree.getSelectedOrganizations();

    this._userService
      .createOrUpdateUser(input)
      .finally(() => {
        this.saving = false;
      })
      .subscribe(() => {
        this.notify.success(this.l('SavedSuccessfully'));
        this.success();
      });
  }

  /*
   * 是否为编辑状态
   */
  isEdit(): boolean {
    return this.id !== -1;
  }
  /*
   * 获取选中角色的数量
   */
  getAssignedRoleCount(): number {
    return _.filter(this.roles, { isAssigned: true }).length;
  }

  //#region 头像功能
  /*
   * 图片上传前
   */
  beforeUpload = (file: File) => {
    const isJPG =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif';
    if (!isJPG) {
      abp.message.error(this.l('OnlySupportPictureFile'));
    }
    const isLtXM = file.size / 1024 / 1024 < this.maxProfilPictureBytesValue;
    if (!isLtXM) {
      abp.message.error(
        this.l(
          'ProfilePicture_Warn_SizeLimit',
          this.maxProfilPictureBytesValue,
        ),
      );
    }
    const isValid = isJPG && isLtXM;
    return isValid;
  }
  /*
   * 选择图片后上传事件
   * @param info 反馈信息
   */
  uploadPictureChange(info: { file: UploadFile }) {
    // 状态选择
    switch (info.file.status) {
      case 'done': // 上传完成
        // 获取服务端返回的信息
        if (info.file.response.success) {
          // 上传成功后直接把图片Id给user实体
          this.user.profilePictureId =
            info.file.response.result.profilePictureId;
        }
        break;
      case 'error': // 上传错误
        abp.message.error(this.l('UploadFailed'));
        break;
    }
  }
  /**
   * 头像预览处理
   */
  handleProfilePreview = (file: UploadFile) => {
    this.profilePreviewImage = file.url || file.thumbUrl;
    this.profilePreviewVisible = true;
  }

  /*
   * 移除头像，同时删除数据中的图像数据
   */
  removeProfilePicture = (file: UploadFile): Observable<boolean> => {
    // if (!this.user.profilePictureId) return of(true);
    // if (!this.isGranted('Pages.Administration.Users.DeleteProfilePicture')) {
    //   abp.message.error(
    //     this.l(
    //       'YouHaveNoXPermissionsWarningMessage',
    //       this.l('DeleteProfilePicture'),
    //     ),
    //   );
    //   return of(false);
    // }
    this._profileService
      .deleteProfilePictureById(this.user.profilePictureId)
      .pipe(catchError(err => of('deleteProfilePicture fail!')))
      .subscribe(res => {
        this.user.profilePictureId = '';
        abp.message.success(this.l('SuccessfullyDeleted'));
      });
    return of(true);
  }
  /*
   * 通过头像Id获取头像
   * @param profilePictureId 头像Id
   */
  getProfilePicture(profilePictureId: string): void {
    if (profilePictureId) {
      this.profileLoading = true;
      this._profileService
        .getProfilePictureById(profilePictureId)
        .finally(() => (this.profileLoading = false))
        .subscribe(result => {
          if (result && result.profilePicture) {
            this.profilePreviewImage =
              'data:image/jpeg;base64,' + result.profilePicture;

            // 把图像加到头像列表 显示
            this.profileList.push({
              uid: -1,
              name: profilePictureId,
              status: 'done',
              url: this.profilePreviewImage,
            });
          }
        });
    }
  }
  //#endregion
}
