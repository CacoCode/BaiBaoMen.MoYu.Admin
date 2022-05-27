import {
  OrganizationUnitDto,
  ListResultDtoOfOrganizationUnitDto
} from '@shared/service-proxies/service-proxies';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Injector,
  TemplateRef,
} from '@angular/core';
import {
  NzTreeNode,
  NzDropdownContextComponent,
  NzDropdownService,
  NzFormatEmitEvent,
} from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import {
  OrganizationUnitServiceProxy,
  MoveOrganizationUnitInput,
} from '@shared/service-proxies/service-proxies';
import { ArrayService } from '@delon/util';
import * as _ from 'lodash';
import { finalize, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CreateOrEditOrganiaztionUnitComponent } from '@app/admin/organization-units/create-or-edit-organiaztion-unit/create-or-edit-organiaztion-unit.component';

@Component({
  selector: 'app-organization-unit-tree-panel',
  templateUrl: './organization-unit-tree-panel.component.html',
  styleUrls: ['./organization-unit-tree-panel.component.less'],
})
export class OrganizationUnitTreePanelComponent extends AppComponentBase
  implements OnInit {
  @Output()
  selectedChange = new EventEmitter<NzTreeNode>();
  /*
   * 加载中
   */
  loading = false;
  /*
   * 总机构数
   */
  totalUnitCount = 0;
  /*
   * 树数据
   */
  _treeData: NzTreeNode[] = [];
  /*
   * 组织机构源数据
   */
  private _ouData: OrganizationUnitDto[] = [];
  /*
   * 右键菜单
   */
  contextMenu: NzDropdownContextComponent;
  /*
   * 激活的节点，只能激活一个
   */
  activedNode: NzTreeNode;
  /*
   * 拖拽源节点
   */
  private dragSrcNode: NzTreeNode;
  /*
   * 拖拽目标节点
   */
  private dragTargetNode: NzTreeNode;
  /*
   * 拖拽中
   */
  draging = false;
  /*
   * 构造函数
   * @param injector 注入器
   * @param _organizationUnitService 机构获取数据服务
   */
  constructor(
    injector: Injector,
    private _organizationUnitService: OrganizationUnitServiceProxy,
    private _nzDropdownService: NzDropdownService,
    private _arrayService: ArrayService,
  ) {
    super(injector);
  }

  /*
   * 初始化
   */
  ngOnInit(): void {
    this.reload();
  }

  /*
   * 重新加载
   */
  reload(): void {
    this.getTreeDataFromServer(treeData => {
      this.totalUnitCount = this._ouData.length;
      this._treeData = treeData;
    });
  }

  /*
   * 从服务端获取数据
   * @param callback 回调函数
   */
  private getTreeDataFromServer(callback: (ous: NzTreeNode[]) => void): void {
    this.loading = true;
    this._organizationUnitService
      .getOrganizationUnits()
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
        this._ouData = result.items;
        const treeData = this.treeDataMap();
        callback(treeData);
      });
  }

  /*
   * 重组Tree数据
   */
  treeDataMap(): NzTreeNode[] {
    const _treeData: NzTreeNode[] = [];
    const ouDtataParentIsNull = _.filter(
      this._ouData,
      item => (<OrganizationUnitDto>item).parentId === null,
    );
    ouDtataParentIsNull.forEach(item => {
      const treeItem = this._recursionGenerateTree(item);
      _treeData.push(treeItem);
    });
    return _treeData;
  }

  /*
   * 递归重组特性菜单为nzTree数据类型
   * @param item 组织机构项
   */
  private _recursionGenerateTree(item: OrganizationUnitDto): NzTreeNode {
    // 叶子节点
    const childs = _.filter(
      this._ouData,
      child => (<OrganizationUnitDto>child).parentId === item.id,
    );
    // 父节点 无返回undefined
    const parentOu = _.find(
      this._ouData,
      p => (<OrganizationUnitDto>p).id === item.parentId,
    );
    const _treeNode = new NzTreeNode({
      title: item.displayName,
      key: item.id.toString(),
      isLeaf: childs && childs.length <= 0,
      expanded: true,
      isMatched: true,
      code: item.code,
      memberCount: item.memberCount,
      dto: item,
      parent: parentOu,
    });
    if (childs && childs.length) {
      childs.forEach(itemChild => {
        const childItem = this._recursionGenerateTree(itemChild);
        _treeNode.children.push(childItem);
      });
    }
    return _treeNode;
  }

  /*
   * 展开文件夹图标事件
   * @param data 节点数据或事件数据
   */
  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    if (data instanceof NzTreeNode) {
      if (!data.isExpanded) {
        data.origin.isLoading = true;
        setTimeout(() => {
          data.isExpanded = !data.isExpanded;
          data.origin.isLoading = false;
        }, 500);
      } else {
        data.isExpanded = !data.isExpanded;
      }
    } else {
      if (!data.node.isExpanded) {
        data.node.origin.isLoading = true;
        setTimeout(() => {
          data.node.isExpanded = !data.node.isExpanded;
          data.node.origin.isLoading = false;
        }, 500);
      } else {
        data.node.isExpanded = !data.node.isExpanded;
      }
    }
  }

  /*
   * 选中节点
   * @param data 当前几点数据
   */
  activeNode(data: NzFormatEmitEvent): void {
    this._setActiveNodeValue(data.node);
  }

  /*
   * 设置当前激活（选中）节点的值
   * @param currentNode 当前节点
   */
  private _setActiveNodeValue(currentNode: NzTreeNode) {
    this._setActiveNodeNull(false);
    currentNode.isSelected = true;
    this.activedNode = currentNode;
    // 选中后发射到父页面
    this.selectedChange.emit(currentNode);
  }

  /*
   * 设置当前激活节点为null（未选中）
   * @param isEmit 是否发射父页面，默认：`true`
   */
  private _setActiveNodeNull(isEmit: boolean = true) {
    if (this.activedNode) {
      this.activedNode = null;
      if (isEmit) {
        // 清空后发射到父页面
        this.selectedChange.emit(null);
      }
    }
  }

  /*
   * 拖拽进入事件（与某节点重合）
   * @param event 事件
   */
  dragEnter(event: NzFormatEmitEvent): void {
    this.dragSrcNode = null;
    this.dragTargetNode = null;
    this.dragSrcNode = event.dragNode;
    this.dragTargetNode = event.node;
  }

  /*
   * 拖拽保存数据事件（当：目标节点为叶子节点时触发：dragEnd事件，当目标节点为非叶子节点时触发dragDrop事件）
   * @param event 事件
   */
  dragSaveData(event: NzFormatEmitEvent): void {
    if (this.dragSrcNode && this.dragTargetNode) {
      if (this.dragSrcNode.key !== this.dragTargetNode.key) {
        this.draging = true;
        this.message.confirm(
          this.l(
            'OrganizationUnitMoveConfirmMessage',
            this.dragSrcNode.title,
            this.dragTargetNode.title,
          ),
          this.l('MessageConfirmOperation'),
          isConfirmed => {
            if (isConfirmed) {
              const input = new MoveOrganizationUnitInput();
              input.id = parseInt(this.dragSrcNode.key, null);
              input.newParentId =
                this.dragTargetNode === null
                  ? undefined
                  : parseInt(this.dragTargetNode.key, null);
              this._organizationUnitService
                .moveOrganizationUnit(input)
                .pipe(
                  finalize(() => {
                    this.draging = false;
                    this.reload();
                  }),
                  catchError(error => {
                    return throwError(error);
                  }),
                )
                .subscribe(() => {
                  this.notify.success(this.l('SuccessfullyMoved'));
                });
            } else {
              this.reload();
              this.draging = false;
            }
          },
        );
      }
    }
  }

  /*
   * 创建右键菜单
   * @param $event 鼠标事件
   * @param template 右键模板
   * @param node 当前节点
   */
  createContextMenu(
    $event: MouseEvent,
    template: TemplateRef<void>,
    node: NzTreeNode,
  ): void {
    this.contextMenu = this._nzDropdownService.create($event, template);
    // 选中当前右键的项
    this._setActiveNodeValue(node);
  }

  /*
   * 新增组织机构
   * @param parentId 父节点ID
   */
  addUnit(parentId?: number): void {
    // 当添加根节点时，如有选中的菜单项则清空
    if (!parentId) {
      this._setActiveNodeNull();
    }
    // 添加子节点时显示为XX添加子节点
    let _parentDisplayName = null;
    if (this.activedNode) {
      _parentDisplayName = this.activedNode.title;
    }
    this.modalHelper
      .static(CreateOrEditOrganiaztionUnitComponent, {
        organizationUnit: {
          parentId: parentId,
          parentDisplayName: _parentDisplayName,
        },
      }, 'md')
      .subscribe((res: OrganizationUnitDto) => {
        if (res) {
          // 更新新增的节点至UI
          this.unitCreated(res);
        }
      });
  }

  /*
   * 新增后更新节点至UI，无需再次查数据库
   * @param ou 当前新增的OU实体
   */
  unitCreated(ou: OrganizationUnitDto): void {
    // 在源数据中加入新增的数据
    this._ouData.push(ou);
    // 操作树数据
    let childs = _.filter(
      this._ouData,
      child => (<OrganizationUnitDto>child).parentId === ou.id,
    );
    const _treeNode = new NzTreeNode({
      title: ou.displayName,
      key: ou.id.toString(),
      isLeaf: childs && childs.length <= 0,
      expanded: true,
      isMatched: true,
      code: ou.code,
      memberCount: ou.memberCount,
      dto: ou,
    });
    if (this.activedNode) {
      // 更新当前激活节点是否有子节点
      childs = _.filter(
        this._ouData,
        child =>
          (<OrganizationUnitDto>child).parentId === parseInt(this.activedNode.key, null),
      );
      this.activedNode.isLeaf = childs && childs.length <= 0;

      // 把新增的节点插入到激活节点的子节点
      this.activedNode.children.push(_treeNode);
    } else {
      // 插入根节点中
      this._treeData.push(_treeNode);
    }

    this.totalUnitCount += 1;
  }

  /*
   * 添加子节点
   * @param node 当前选中节点
   */
  addSubUnit() {
    const canManageOrganizationTree = this.isGranted(
      'Pages.Administration.OrganizationUnits.ManageOrganizationTree',
    );
    if (!canManageOrganizationTree) {
      abp.message.error(this.l('YouHaveNoOperatingPermissions'));
      return;
    }
    if (this.activedNode.key) {
      // tslint:disable-next-line:radix
      this.addUnit(parseInt(this.activedNode.key));
    }
    this.contextMenu.close();
  }
  /*
   * 编辑组织机构
   */
  editUnit(): void {
    const canManageOrganizationTree = this.isGranted(
      'Pages.Administration.OrganizationUnits.ManageOrganizationTree',
    );
    if (!canManageOrganizationTree) {
      abp.message.error(this.l('YouHaveNoOperatingPermissions'));
      return;
    }
    if (this.activedNode.key) {
      const ouPars = {
        // tslint:disable-next-line:radix
        id: parseInt(this.activedNode.key),
        displayName: this.activedNode.title,
      };
      this.modalHelper
        .static(CreateOrEditOrganiaztionUnitComponent, {
          organizationUnit: ouPars,
        })
        .subscribe((res: OrganizationUnitDto) => {
          if (res) {
            // 直接更新节点，无需再次请求数据库
            this.activedNode.title = res.displayName;
          }
        });
    }
    this.contextMenu.close();
  }

  /*
   * 删除组织结构
   */
  deleteUnit(): void {
    const canManageOrganizationTree = this.isGranted(
      'Pages.Administration.OrganizationUnits.ManageOrganizationTree',
    );
    if (!canManageOrganizationTree) {
      abp.message.error(this.l('YouHaveNoOperatingPermissions'));
      return;
    }
    if (this.activedNode.key) {
      this._organizationUnitService
        // tslint:disable-next-line:radix
        .deleteOrganizationUnit(parseInt(this.activedNode.key))
        .subscribe(() => {
          this.totalUnitCount -= 1;
          this.unitDeletedData();
          this.notify.success(this.l('SuccessfullyDeleted'));
        });
    }
    this.contextMenu.close();
  }

  /*
   * 删除后直接操作本地数据，无需再次从数据库获取
   */
  private unitDeletedData(): void {
    // 删除源数据
    _.remove(this._ouData, oRemove => {
      // tslint:disable-next-line:radix
      return oRemove.id === parseInt(this.activedNode.key);
    });
    // 递归删除tree节点数据
    this._treeData.forEach(item => {
      if (item.key === this.activedNode.key) {
        _.remove(this._treeData, tRemove => {
          return tRemove.key === this.activedNode.key;
        });
        this._setActiveNodeNull();
        return;
      }
      this._unitDeletedSubData(item);
    });
  }

  /*
   * 如果删除的数据不在父节点中就遍历子节点，直到找到删除为止
   * @param item 节点数据
   */
  private _unitDeletedSubData(item: NzTreeNode): void {
    if (item && item.children) {
      item.children.forEach(itemChild => {
        if (itemChild.key === this.activedNode.key) {
          _.remove(item.children, remove => {
            return remove.key === this.activedNode.key;
          });
          // 如无子节点则设置为叶子节点
          item.isLeaf = !item.children.length;
          this._setActiveNodeNull();
          return;
        }
        this._unitDeletedSubData(itemChild);
      });
    }
  }

  /*
   * 成员新增后操作人数事件
   * @param userIds 新增的成员Id类表
   */
  membersAdded(userIds: number[]): void {
    this.incrementMemberCount(userIds.length);
  }

  /*
   * 成员移除后操作人数事件
   * @param userIds 移除的成员Id类表
   */
  memberRemoved(userIds: number[]): void {
    this.incrementMemberCount(-userIds.length);
  }

  /*
   * 机构成员数量操作
   * @param incrementAmount 增量
   */
  incrementMemberCount(incrementAmount: number): void {
    this.activedNode.origin.memberCount =
      this.activedNode.origin.memberCount + incrementAmount;
    if (this.activedNode.origin.memberCount < 0)
      this.activedNode.origin.memberCount = 0;
  }
}
