import { DataTable, Cell } from './base';
import { HeaderCell } from './header-cell';
import { BodyCell } from './body-cell';

export class DataTableComponent extends HTMLElement {

  get table(): DataTable { return this._table; }
  set table(val: DataTable) {
    this._table = val;
    this.render();
  }
  private _table: DataTable;

  private headerCells: HeaderCell[] = [];
  private bodyCells: BodyCell[] = [];

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
    this.createDropdownMenu();
  }

  private createHeader() {
    const header = document.createElement('div');
    header.classList.add('datatable-header', 'dt-sticky-header');
    header.style.width = this.table.dimensions.columnsTotalWidth + 'px';

    const rowEl = document.createElement('div');
    rowEl.classList.add('datatable-header-row');
    header.append(rowEl);

    this.table.preparedColumns.forEach(column => {
      const headerCell = new HeaderCell(this.table, column);
      this.headerCells.push(headerCell);
      rowEl.append(headerCell.element);
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
        const cell = new Cell(row, column);
        const bodyCell = new BodyCell(this.table, cell);
        this.bodyCells.push(bodyCell);
        rowEl.append(bodyCell.element);
      });
    });

    this.append(body);
  }

  private createDropdownMenu() {
    const dropdownMenuEl = document.createElement('div');
    dropdownMenuEl.classList.add('dropdown-filter-menu');
    dropdownMenuEl.style.display = 'none';
    this.append(dropdownMenuEl);
  }

}

customElements.define('web-data-table', DataTableComponent);
