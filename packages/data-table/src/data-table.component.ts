import { DataTable } from './base';

export class DataTableComponent extends HTMLElement {

  get table(): DataTable { return this._table; }
  set table(val: DataTable) {
    this._table = val;
    this.render();
  }
  private _table: DataTable;

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
    this.createHeader();
    this.createBody();
  }

  private createHeader() {
    const header = document.createElement('div');
    header.classList.add('datatable-header', 'dt-sticky-header');
    header.style.width = this.table.dimensions.columnsTotalWidth + 'px';

    const rowEl = document.createElement('div');
    rowEl.classList.add('datatable-header-row');
    header.append(rowEl);

    this.table.preparedColumns.forEach(column => {
      const cellEl = document.createElement('div');
      cellEl.classList.add('datatable-header-cell');
      cellEl.textContent = column.title;
      cellEl.style.width = column.width + 'px';
      if (column.frozen) {
        cellEl.classList.add('dt-sticky');
        cellEl.style.left = column.left + 'px';
      }
      rowEl.append(cellEl);
    });

    this.append(header);
  }

  private createBody() {
    const body = document.createElement('div');
    body.classList.add('datatable-body');
    body.style.width = this.table.dimensions.columnsTotalWidth + 'px';

    this.table.rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.classList.add('datatable-body-row');
      rowEl.style.height = this.table.dimensions.rowHeight + 'px';
      body.append(rowEl);

      this.table.preparedColumns.forEach(column => {
        const cellEl = document.createElement('div');
        cellEl.classList.add('datatable-body-cell');
        cellEl.textContent = row[column.name];
        cellEl.style.width = column.width + 'px';
        if (column.frozen) {
          cellEl.classList.add('dt-sticky');
          cellEl.style.left = column.left + 'px';
        }
        rowEl.append(cellEl);
      });
    });

    this.append(body);
  }

}

customElements.define('web-data-table', DataTableComponent);
