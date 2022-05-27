import { Component, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';

@Component({
    selector: 'data-loading',
    templateUrl: './data-loading-mask.component.html',
    styleUrls: ['./data-loading-mask.component.less']
})

export class DataLoadingMaskComponent extends AppComponentBase {

    @Input() show = true;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }
}
