import { SelectItem, Listener } from '@mazdik-lib/common';
import { DataTable } from '@mazdik-lib/data-table';
import '@mazdik-lib/modal';
import { ModalComponent } from '@mazdik-lib/modal';
import '@mazdik-lib/dual-list-box';
import { DualListBoxComponent } from '@mazdik-lib/dual-list-box';

function getTemplate(id: string) {
  return `
  <web-modal>
    <template select="app-modal-header">
      <span id="modalEditFormTitle${id}">Modal</span>
    </template>
    <template select="app-modal-body">
      <web-dual-list-box></web-dual-list-box>
    </template>
    <template select="app-modal-footer">
      <button class="dt-button" id="modalEditFormSave${id}">Save</button>
      <button class="dt-button dt-green" id="modalEditFormClose${id}" style="float: right;">Close</button>
    </ng-container>
    </template>
  </web-modal>
  `;
}

export class DtColumnTogglerComponent extends HTMLElement {

  table: DataTable;

  private modalEditFormTitle: HTMLElement;
  private modalEditFormSave: HTMLButtonElement;
  private modalEditFormClose: HTMLButtonElement;
  private modal: ModalComponent;
  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private dualListBox: DualListBoxComponent;

  private selectColumns: SelectItem[] = [];
  private selectedColumns: SelectItem[] = [];

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
    this.dualListBox = document.querySelector('web-dual-list-box') as DualListBoxComponent;

    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'targetChange',
        target: this.dualListBox,
        handler: this.onSelectionChange.bind(this)
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

  private onSelectionChange(event: CustomEvent<SelectItem[]>) {
    this.selectedColumns = event.detail;
  }

  private createSelectItems() {
    this.selectedColumns = this.table.columns.filter(x => !x.tableHidden).map(x => ({ id: x.name, name: x.title }) as SelectItem);
    this.selectColumns = this.table.columns.map(x => ({ id: x.name, name: x.title }) as SelectItem);
  }

  private onClickSave() {
    this.table.columns.forEach(x => {x.tableHidden = true; x.index = 99; });
    this.selectedColumns.forEach((el, i) => {
      const index = this.table.columns.findIndex(x => x.name === el.id);
      this.table.columns[index].tableHidden = false;
      this.table.columns[index].index = i;
    });
    this.table.columns.sort((a, b) => (a.index > b.index) ? 1 : (a.index < b.index) ? -1 : 0);
    this.table.initColumns();
    this.table.events.emitRowsChanged();
    this.table.events.emitResizeEnd();

    this.modal.hide();
  }

  onClickClose() {
    this.modal.hide();
  }

  open() {
    this.modalEditFormTitle.textContent = this.table.messages.columns;
    this.modalEditFormSave.textContent = this.table.messages.save;
    this.modalEditFormClose.textContent = this.table.messages.close;

    this.createSelectItems();
    this.dualListBox.source = this.selectColumns;
    this.dualListBox.target = this.selectedColumns;

    this.modal.show();
  }

}

customElements.define('web-dt-column-toggler', DtColumnTogglerComponent);
