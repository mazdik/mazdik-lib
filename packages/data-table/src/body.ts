import { DataTable } from './base';
import { BodyCell } from './body-cell';
import { BodyRow } from './body-row';

export class Body {

  element: HTMLElement;
  private bodyRows: BodyRow[] = [];
  private bodyCells: BodyCell[] = [];

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-body');
  }

  createRows() {
    this.bodyRows = [];
    this.element.innerHTML = '';
    this.bodyCells = [];
    this.table.rows.forEach(row => {
      const bodyRow = new BodyRow(this.table, row);
      this.bodyRows.push(bodyRow);
      this.element.append(bodyRow.element);

      this.table.preparedColumns.forEach(column => {
        const bodyCell = new BodyCell(row, column);
        this.bodyCells.push(bodyCell);
        bodyRow.element.append(bodyCell.element);
      });
    });
  }

  updateBodyStyles() {
    this.bodyRows.forEach(x => x.updateStyles());
    this.bodyCells.forEach(x => x.updateStyles());
  }

}
