import { ModalComponent } from '@mazdik-lib/modal';
import { DynamicFormElement, GetOptionsFunc } from '@mazdik-lib/dynamic-form';
import { KeyValuePair } from '@mazdik-lib/row-view';
//import { DataManager } from '../ng-crud-table/base/data-manager';

export class ModalEditFormComponent extends HTMLElement {

  dataManager: any; //DataManager;
  isNewItem: boolean;
  detailView: boolean;

  private childModal: ModalComponent;

  dynElements: DynamicFormElement[];
  formValid: boolean = true;
  transposedData: KeyValuePair[];
  getOptionsFunc: GetOptionsFunc;

  constructor() {
    super();
  }

  ngOnInit() {
    this.getOptionsFunc = this.dataManager.service.getOptions.bind(this.dataManager.service);
  }

  get modalTitle() {
    if (!this.detailView) {
      return this.isNewItem ? this.dataManager.messages.titleCreate :
        this.dataManager.messages.titleUpdate;
    } else {
      return this.dataManager.messages.titleDetailView;
    }
  }

  save() {
    if (this.isNewItem) {
      this.dataManager.create(this.dataManager.item);
    } else {
      this.dataManager.update(this.dataManager.item);
    }
    this.childModal.hide();
    //this.cd.markForCheck();
  }

  open() {
    this.childModal.show();
    //this.cd.markForCheck();
  }

  close() {
    this.childModal.hide();
    //this.cd.markForCheck();
  }

  onFormValid(event: any) {
    this.formValid = event;
  }

}

customElements.define('web-modal-edit-form', ModalEditFormComponent);
