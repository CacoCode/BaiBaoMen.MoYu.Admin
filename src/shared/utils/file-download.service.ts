import { Injectable } from '@angular/core';
import { FileDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Injectable()
export class FileDownloadService {
  downloadTempFile(file: FileDto) {
    const url = `${
      AppConsts.remoteServiceBaseUrl
    }/File/DownloadTempFile?fileType=${file.fileType}&fileToken=${
      file.fileToken
    }&fileName=${file.fileName}`;
    location.href = url; // TODO: 这将导致在Firefox中重新加载相同的页面,需要等待修复
  }
}
