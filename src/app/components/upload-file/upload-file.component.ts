import { Component, Injector, Input } from '@angular/core';
import { UploadFile } from 'ng-zorro-antd';
import { AppComponentBase } from '@shared/component-base';
import { AddObjectAttachmentInfosInput, CommonServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Component({
  selector: 'file-upload',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.less'],
})
export class UploadFileComponent extends AppComponentBase {

  @Input() fileInput: AddObjectAttachmentInfosInput | null;
  //input: AddObjectAttachmentInfosInput =new AddObjectAttachmentInfosInput();

  uploadUrl: string;
  loading = false;
  avatarUrl: string;

  constructor(
    injector: Injector,
    private commonService: CommonServiceProxy
  ) {
    super(injector);
    this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/Attachment/UploadFiles';
  }

  ngOnInit(): void {
    this.commonService.getObjectImages(this.fileInput.objectType, this.fileInput.objectId)
    .pipe()
    .subscribe((result) => {
        result.forEach(element => {
            this.avatarUrl=element.url;
        });
    });
  }

  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    const isJPNG = file.type === 'image/png';
    if (!isJPG && !isJPNG) {
      this.message.errorMsg('只能上传PNG/JPG/JPEG格式图片！');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      this.message.errorMsg('图片大小不能超过5照');
    }
    return isJPG || isJPNG && isLt2M;
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });

      if (this.fileInput) {
        info.file.response.result.forEach(element => {
          this.fileInput.attachmentInfoIds.push(element.id);
        });
        this.commonService.addObjectAttachmentInfos(this.fileInput)
          .subscribe(() => {
            this.message.successMsg('上传成功')
          });
      }
    }
  }
}

