import { Injectable } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class ZorroMessageService {

    constructor(private modalSrv: NzModalService, private message: NzMessageService) { }

    info(message: string, title: string = "通知信息"): any {
        this.modalSrv.info({
            nzTitle: title,
            nzContent: message
        })
    }

    success(message: string, title: string = "成功信息"): any {
        this.modalSrv.success({
            nzTitle: title,
            nzContent: message
        })
    }

    warn(message: string, title: string = "警告信息"): any {
        this.modalSrv.warning({
            nzTitle: title,
            nzContent: message
        })
    }

    error(message: string, title: string = "失败信息"): any {
        this.modalSrv.error({
            nzTitle: title,
            nzContent: message
        })
    }

    confirm(message: string, titleOrCallBack?: string | ((result: boolean) => void), callback?: (result: boolean) => void): any {
        if (typeof titleOrCallBack == 'string') {
            this.modalSrv.confirm({
                nzTitle: titleOrCallBack,
                nzContent: message,
                nzOnOk() {
                    if (callback) callback(true);
                },
                nzOnCancel() {
                    if (callback) callback(false);
                }
            });
        } else {
            this.modalSrv.confirm({
                nzTitle: "确认操作",
                nzContent: message,
                nzOnOk() {
                    if (titleOrCallBack) titleOrCallBack(true);
                },
                nzOnCancel() {
                    if (titleOrCallBack) titleOrCallBack(false);
                }
            });
        }
    }

    loading(message: string = "加载中.."): string {
        return this.message.loading(message, { nzDuration: 0 }).messageId;
    }

    successMsg(message: string = "操作成功"){
        this.message.create('success', message);
    }

    errorMsg(message: string = "操作失败"){
        this.message.create('error', message);
    }

    warningMsg(message: string = "操作异常"){
        this.message.create('warning',message );
    }

    remove(id: string) {
        this.message.remove(id)
    }
}