import '@mazdik-lib/modal';
import '@mazdik-lib/dynamic-form';
import '@mazdik-lib/row-view';
import { ModalComponent } from '@mazdik-lib/modal';
import { DynamicFormComponent, DynamicFormElement, Dict } from '@mazdik-lib/dynamic-form';
import { RowViewComponent, KeyValuePair } from '@mazdik-lib/row-view';
import { Listener } from '@mazdik-lib/common';

function getTemplate(id: string) {
  return `
  <web-modal>
    <template select="app-modal-header">
      <span id="modalEditFormTitle${id}">Modal</span>
    </template>
    <template select="app-modal-body">
      <web-dynamic-form></web-dynamic-form>
      <web-row-view></web-row-view>
    </template>
    <template select="app-modal-footer">
      <button class="dt-button" id="modalEditFormSave${id}">Save</button>
      <button class="dt-button dt-green" id="modalEditFormClose${id}" style="float: right;">Close</button>
    </ng-container>
    </template>
  </web-modal>
  `;
}

export class ModalEditFormComponent extends HTMLElement {

  item: Dict = {};
  getViewDataFunc: () => KeyValuePair[];

  set dynElements(val: DynamicFormElement[]) {
    this.dynamicForm.dynElements = val;
  }

  set modalTitle(val: string) {
    this.modalEditFormTitle.textContent = val;
  }

  set saveMessage(val: string) {
    this.modalEditFormSave.textContent = val;
  }

  set closeMessage(val: string) {
    this.modalEditFormClose.textContent = val;
  }

  private isNewItem: boolean;
  private modalEditFormTitle: HTMLElement;
  private modalEditFormSave: HTMLButtonElement;
  private modalEditFormClose: HTMLButtonElement;
  private modal: ModalComponent;
  private dynamicForm: DynamicFormComponent;
  private rowView: RowViewComponent;
  private listeners: Listener[] = [];
  private isInitialized: boolean;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    const id = (~~(Math.random() * 1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.append(template.content.cloneNode(true));

    this.modalEditFormTitle = this.querySelector('#modalEditFormTitle' + id);
    this.modalEditFormSave = this.querySelector('#modalEditFormSave' + id);
    this.modalEditFormClose = this.querySelector('#modalEditFormClose' + id);
    this.modal = this.querySelector('web-modal') as ModalComponent;
    this.dynamicForm = this.querySelector('web-dynamic-form') as DynamicFormComponent;
    this.rowView = this.querySelector('web-row-view') as RowViewComponent;

    this.dynamicForm.style.display = 'none';
    this.rowView.style.display = 'none';
    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'valid',
        target: this.dynamicForm,
        handler: this.onFormValid.bind(this)
      },
      {
        eventName: 'click',
        target: this.modalEditFormSave,
        handler: this.onClickSave.bind(this)
      },
      {
        eventName: 'click',
        target: this.modalEditFormClose,
        handler: this.onClickClose.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onClickSave() {
    if (this.isNewItem) {
      this.dispatchEvent(new CustomEvent('create', { detail: this.item }));
    } else {
      this.dispatchEvent(new CustomEvent('update', { detail: this.item }));
    }
    this.modal.hide();
  }

  private onClickClose() {
    this.modal.hide();
  }

  private onFormValid(event: CustomEvent<boolean>) {
    this.modalEditFormSave.disabled = !event.detail;
  }

  create() {
    this.rowView.style.display = 'none';
    this.dynamicForm.style.display = 'block';
    this.modalEditFormSave.style.visibility = 'visible';
    this.item = {};
    this.dynamicForm.item = this.item;
    this.isNewItem = true;
    this.modal.show();
  }

  update(isNewItem: boolean = false) {
    this.rowView.style.display = 'none';
    this.dynamicForm.style.display = 'block';
    this.modalEditFormSave.style.visibility = 'visible';
    this.dynamicForm.item = this.item;
    this.isNewItem = isNewItem;
    this.modal.show();
  }

  view() {
    this.rowView.style.display = 'block';
    this.dynamicForm.style.display = 'none';
    this.modalEditFormSave.style.visibility = 'hidden';
    this.rowView.data = (this.getViewDataFunc) ? this.getViewDataFunc() : this.getData();
    this.modal.show();
  }

  private getData(): KeyValuePair[] {
    return Object.keys(this.item).map(key => {
      return { key, value: this.item[key] };
    });
  }

}

customElements.define('web-modal-edit-form', ModalEditFormComponent);
