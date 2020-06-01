import { DataTable } from './base';

export class DataTableComponent extends HTMLElement {

  table: DataTable;

  constructor() {
    super();
    this.classList.add('datatable');
  }

  connectedCallback() {
    //this.onInit();
  }

  disconnectedCallback() {
    //this.removeEventListeners();
  }

  private render() {

  }

  private createHeader() {
    const header = document.createElement('div');
    header.classList.add('datatable-header', 'dt-sticky-header');

    const row = document.createElement('div');
    row.classList.add('datatable-body-row');
    header.append(row);

  }

  private createBody() {
    const body = document.createElement('div');
    body.classList.add('datatable-body');
  }

}

customElements.define('web-data-table', DataTableComponent);
