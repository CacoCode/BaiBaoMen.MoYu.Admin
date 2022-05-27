import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EditionServiceProxy, SubscribableEditionComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';

@Component({
  selector: 'edition-combo',
  templateUrl: './edition-combo.component.html',
  styles: []
})
export class EditionComboComponent extends AppComponentBase implements OnInit {
  editions: SubscribableEditionComboboxItemDto[] = [];
  @Input() placeholder: string;
  @Input() selectedEdition: SubscribableEditionComboboxItemDto = undefined;
  @Output() selectedEditionChange: EventEmitter<SubscribableEditionComboboxItemDto> = new
    EventEmitter<SubscribableEditionComboboxItemDto>();

  @Input() addAllItem: boolean;
  @Input() addNotAssignedItem: boolean;


  private _editionId: string;
  @Input()
  set editionId(value: string) {
    this._editionId = value;
    this.autoSelect();
  }

  constructor(
    private _editionService: EditionServiceProxy,
    injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this._editionService.getEditionComboboxItems(0, this.addAllItem, false, this.addNotAssignedItem)
      .subscribe(editions => {
        this.editions = editions;
        this.autoSelect();
      });
  }


  autoSelect() {
    if (!this.editions || !this._editionId) {
      return;
    }
    this.selectedEdition = this.editions.find(item => item.value === this._editionId.toString());
    if (this.selectedEditionChange) {
      this.selectedEditionChange.emit(this.selectedEdition);
    }
  }
}
