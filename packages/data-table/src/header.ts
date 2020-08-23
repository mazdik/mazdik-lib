import { DataTable } from './base';
import { HeaderCell } from './header-cell';

export class Header {

  element: HTMLElement;
  private headerRow: HTMLElement;
  private headerCells: HeaderCell[] = [];

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-header', 'dt-sticky-header');

    if (this.table.settings.columnGroupTemplate) {
      const el = this.table.settings.columnGroupTemplate.create({ table: this.table });
      this.element.append(el);
    }

    this.headerRow = document.createElement('div');
    this.headerRow.classList.add('datatable-header-row');
    this.element.append(this.headerRow);
  }

  destroy() {
    this.headerCells.forEach(x => x.destroy());
    if (this.table.settings.columnGroupTemplate) {
      this.table.settings.columnGroupTemplate.destroy();
    }
  }

  createHeaderCells() {
    this.headerCells = [];
    this.headerRow.innerHTML = '';
    this.table.preparedColumns.forEach(column => {
      const headerCell = new HeaderCell(this.table, column);
      this.headerCells.push(headerCell);
      this.headerRow.append(headerCell.element);
    });
  }

  updateHeaderStyles() {
    this.headerCells.forEach(x => x.updateStyles());
    if (this.table.settings.columnGroupTemplate) {
      this.table.settings.columnGroupTemplate.refresh({ table: this.table });
    }
  }

}
