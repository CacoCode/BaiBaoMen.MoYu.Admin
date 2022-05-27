import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  // LanguageListDto,
  ApplicationLanguageListDto,
  LanguageServiceProxy,
  SetDefaultLanguageInput,
} from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { CreateOrEditLanguageComponent } from '@app/admin/languages/create-or-edit-language/create-or-edit-language.component';
import * as _ from 'lodash';

/*
*重构
*/
import { AppComponentBase } from '@shared/component-base/app-component-base';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styles: [],
})
/*
* 重构
* PagedListingComponentBase<LanguageListDto>
 */
export class LanguagesComponent extends AppComponentBase {
  defaultLanguageName: string;
  dataList: ApplicationLanguageListDto[] = [];
  pageSize: number;

  constructor(
    injector: Injector,
    private _languageService: LanguageServiceProxy,
    private router: Router,
  ) {
    super(injector);
  }

  // changeTexts(language: LanguageListDto): void {
  //   const self = this;
  //   setTimeout(() => {
  //     self.router.navigate(['app/admin/languagetexts', { lang: language.name }]);
  //   }, 300);
  // }

  // setAsDefaultLanguage(language: LanguageListDto): void {
  //   const input = new SetDefaultLanguageInput();
  //   input.name = language.name;
  //   this._languageService.setDefaultLanguage(input).subscribe(() => {
  //     this.refresh();
  //     this.notify.success(this.l('SuccessfullySaved'));
  //   });
  // }

  /*
  * 以前的
  */

  // deleteLanguage(language: LanguageListDto): void {
  //   this.message.confirm(
  //     this.l('LanguageDeleteWarningMessage', language.displayName),
  //     isConfirmed => {
  //       if (isConfirmed) {
  //         this.languageService.deleteLanguage(language.id).subscribe(() => {
  //           this.refresh();
  //           this.notify.success(this.l('SuccessfullyDeleted'));
  //         });
  //       }
  //     },
  //   );
  // }

  createOrEditLanguage(languageId?: number): void {
    this.modalHelper
      .open(CreateOrEditLanguageComponent, { languageId: languageId })
      .subscribe(res => {
        if (res) {
          // this.refresh();
        }
      });
  }

  protected fetchDataList(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this._languageService
      .getLanguages()
      .finally(() => {
        finishedCallback();
      })
      .subscribe(result => {
        this.dataList = result.items;
        this.defaultLanguageName = result.defaultLanguageName;
        this.pageSize = result.items.length;
      });
  }

  /*
   * 删除
   * @param language 语言实体
   * 方法原始传参 LanguageListDto
   */

  delete(language: any): void {
    this._languageService.deleteLanguage(language.id).subscribe(() => {
      // this.refresh();
      this.notify.success(this.l('SuccessfullyDeleted'));
    });
  }

  /**
   * 批量删除
   */
  batchDelete(): void {
    // const selectCount = this.selectedDataItems.length;
    // if (selectCount <= 0) {
    //   abp.message.warn(this.l('PleaseSelectAtLeastOneItem'));
    //   return;
    // }

    // abp.message.confirm(
    //   this.l('ConfirmDeleteXItemsWarningMessage', selectCount),
    //   res => {
    //     if (res) {
    //       const ids = _.map(this.selectedDataItems, 'id');
    //       this._languageService.batchDelete(ids).subscribe(() => {
    //         this.refresh();
    //         this.notify.success(this.l('SuccessfullyDeleted'));
    //       });
    //     }
    //   },
    // );
  }
}
