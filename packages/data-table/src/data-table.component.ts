import { DataTable, Cell } from './base';
import { HeaderCell } from './header-cell';
import { BodyCell } from './body-cell';
import { BodyRow } from './body-row';

export class DataTableComponent extends HTMLElement {

  get table(): DataTable { return this._table; }
  set table(val: DataTable) {
    this._table = val;
    this.render();
  }
  private _table: DataTable;

  private header: HTMLElement;
  private headerRow: HTMLElement;
  private headerCells: HeaderCell[] = [];

  private body: HTMLElement;
  private bodyRows: BodyRow[] = [];
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
    this.createHeaderCells();
    this.createBody();
    this.createRows();
    this.createDropdownMenu();
  }

  private createHeader() {
    this.header = document.createElement('div');
    this.header.classList.add('datatable-header', 'dt-sticky-header');
    this.header.style.width = this.table.dimensions.columnsTotalWidth + 'px';

    this.headerRow = document.createElement('div');
    this.headerRow.classList.add('datatable-header-row');
    this.header.append(this.headerRow);

    this.append(this.header);
  }

  private createHeaderCells() {
    this.table.preparedColumns.forEach(column => {
      const headerCell = new HeaderCell(this.table, column);
      this.headerCells.push(headerCell);
      this.headerRow.append(headerCell.element);
    });
  }

  private createBody() {
    this.body = document.createElement('div');
    this.body.classList.add('datatable-body');
    this.body.style.width = this.table.dimensions.columnsTotalWidth + 'px';
    this.append(this.body);
  }

  private createRows() {
    this.table.rows.forEach(row => {
      const bodyRow = new BodyRow(this.table, row);
      this.bodyRows.push(bodyRow);
      this.body.append(bodyRow.element);

      this.table.preparedColumns.forEach(column => {
        const cell = new Cell(row, column);
        const bodyCell = new BodyCell(this.table, cell);
        this.bodyCells.push(bodyCell);
        bodyRow.element.append(bodyCell.element);
      });
    });
  }

  private createDropdownMenu() {
    const dropdownMenuEl = document.createElement('div');
    dropdownMenuEl.classList.add('dropdown-filter-menu');
    dropdownMenuEl.style.display = 'none';
    this.append(dropdownMenuEl);
  }

  updateStyles() {
    this.headerCells.forEach(x => x.updateStyles());
    this.bodyRows.forEach(x => x.updateStyles());
    this.bodyCells.forEach(x => x.updateStyles());
  }

}

customElements.define('web-data-table', DataTableComponent);
