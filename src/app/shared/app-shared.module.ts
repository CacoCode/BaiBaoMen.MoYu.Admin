import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { DataLoadingMaskComponent } from './data-loading-mask/data-loading-mask.component';
import { InputNoSpaceDirective } from './directives/input-noSpace.directive';


const components = [
    DataLoadingMaskComponent,
    InputNoSpaceDirective,
];

@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        ...components
    ],
    exports: [
        ...components
    ]
})
export class AppSharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppSharedModule,
            providers: []
        };
    }
}
