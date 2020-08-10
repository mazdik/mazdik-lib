import { DataTable } from './base';
import { HeaderCell } from './header-cell';

export class Header {

  element: HTMLElement;
  private headerCells: HeaderCell[] = [];

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-header-row');
    if (!this.table.settings.virtualScroll) {
      this.element.classList.add('dt-sticky-header');
    }
  }

  destroy() {
    this.headerCells.forEach(x => x.destroy());
  }

  createHeaderCells() {
    this.headerCells = [];
    this.element.innerHTML = '';
    this.table.preparedColumns.forEach(column => {
      const headerCell = new HeaderCell(this.table, column);
      this.headerCells.push(headerCell);
      this.element.append(headerCell.element);
    });
  }

  updateHeaderStyles() {
    this.headerCells.forEach(x => x.updateStyles());
  }

}
