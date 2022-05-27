// import { HostCacheDto } from '@shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, AfterViewInit } from '@angular/core';
import { AppComponentBase } from '@shared/component-base/app-component-base';
import {
  CachingServiceProxy,
  EntityDtoOfString,
  WebLogServiceProxy,
} from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import { FileDownloadService } from '@shared/utils/file-download.service';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: [
    './maintenance.component.less'
  ]
})

/*
 * 暂时注释掉后期在做调整
 * extends PagedListingComponentBase<HostCacheDto>
 */
export class MaintenanceComponent extends AppComponentBase implements OnInit {
  logs: any = '';
  constructor(
    injector: Injector,
    private cacheService: CachingServiceProxy,
    private webLogService: WebLogServiceProxy,
    private fileDownloadService: FileDownloadService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // this.refresh();
    this.getWebLogs();
  }

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    // this.cacheService
    //   .getAllCaches()
    //   .finally(() => {
    //     finishedCallback();
    //   })
    //   .subscribe(result => {
    //     this.dataList = result.items;
    //   });
  }
  /*
   * 暂时先注释
   * HostCacheDto
   */
  protected delete(entity: any): void { }

  clearCache(cacheName): void {
    const input = new EntityDtoOfString();
    input.id = cacheName;

    // this.cacheService.clearCache(input).subscribe(() => {
    //   this.notify.success(this.l('CacheSuccessfullyCleared'));
    // });
  }

  clearAllCaches(): void {
    // this.cacheService.clearAllCaches().subscribe(() => {
    //   this.notify.success(this.l('AllCachesSuccessfullyCleared'));
    // });
  }

  getWebLogs(): void {
    // this.webSiteLogService.getLatestWebLogs().subscribe(result => {
    //   this.logs = result.latestWebLogLines;
    // });
  }

  downloadWebLogs = function () {
    this.webSiteLogService.downloadWebLogs().subscribe(result => {
      this.fileDownloadService.downloadTempFile(result);
    });
  };

  getLogClass(log: string): string {
    if (log.startsWith('DEBUG')) {
      return 'label label-default';
    }

    if (log.startsWith('INFO')) {
      return 'label label-info';
    }

    if (log.startsWith('WARN')) {
      return 'label label-warning';
    }

    if (log.startsWith('ERROR')) {
      return 'label label-danger';
    }

    if (log.startsWith('FATAL')) {
      return 'label label-danger';
    }

    return '';
  }

  getLogType(log: string): string {
    if (log.startsWith('DEBUG')) {
      return 'DEBUG';
    }

    if (log.startsWith('INFO')) {
      return 'INFO';
    }

    if (log.startsWith('WARN')) {
      return 'WARN';
    }

    if (log.startsWith('ERROR')) {
      return 'ERROR';
    }

    if (log.startsWith('FATAL')) {
      return 'FATAL';
    }

    return '';
  }

  getRawLogContent(log: string): string {
    return _.escape(log)
      .replace('DEBUG', '')
      .replace('INFO', '')
      .replace('WARN', '')
      .replace('ERROR', '')
      .replace('FATAL', '');
  }
}
