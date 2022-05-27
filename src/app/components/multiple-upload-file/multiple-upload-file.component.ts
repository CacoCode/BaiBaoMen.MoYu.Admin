import { Component, Injector, Input, SimpleChanges } from '@angular/core';


import { UploadFile } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/component-base';
import { CommonServiceProxy, AddObjectAttachmentInfosInput } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';


@Component({
  selector: 'multiple-file-upload',
  templateUrl: './multiple-upload-file.component.html',
  styleUrls: ['./multiple-upload-file.component.less'],
})
export class MultipleUploadFileComponent extends AppComponentBase {

  @Input() fileInput: AddObjectAttachmentInfosInput | null;

  files: any[] = [];
  uploadUrl: string;
  previewImage = '';
  previewVisible = false;

  constructor(
    injector: Injector,
    private commonService: CommonServiceProxy
  ) {
    super(injector);
    this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Attachment/UploadFiles';
  }

  ngOnInit(): void {
    this.commonService.getObjectImages(this.fileInput.objectType, this.fileInput.objectId)
      .subscribe((result) => {
        this.files = result;
      });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }


  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    const isJPNG = file.type === 'image/png';
    if (!isJPG && !isJPNG) {
      this.message.errorMsg('只能上传PNG/JPG/JPEG格式图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      this.message.errorMsg('图片大小不能超过5M');
    }
    return isJPG || isJPNG && isLt2M;
  }



  handleChange(info: { file: UploadFile }): void {

    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if (this.fileInput) {
        info.file.response.result.forEach(element => {
          this.fileInput.attachmentInfoIds.push(element.id);
        });
        this.commonService.addObjectAttachmentInfos(this.fileInput)
          .subscribe(() => {
            this.message.successMsg('图片上传成功')
          });
      }
    }
  }

  fileRemove = (file) => {
    let ids = [file.id];
    this.commonService.removeObjectAttachments(ids,this.fileInput.objectType)
      .subscribe(() => {
        let newArr = this.files.filter(item => {
          if(file.id !== item.id) {
            return true
          }
        })
        this.files = newArr;
        this.message.successMsg('图片删除成功');
        return true;
      });
  }
}

