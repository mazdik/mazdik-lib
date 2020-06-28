import { toggleClass, addClass } from '@mazdik-lib/common';
import { Row, Column, Cell } from './base';

export class BodyCell {

  element: HTMLElement;
  editing: boolean;
  cell: Cell;

  constructor(row: Row, column: Column) {
    this.cell = new Cell(row, column);
    this.cell.updateViewValue();
    this.cell.validate();
    this.createCellElements();
    this.updateStyles();
  }

  private createCellElements() {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-body-cell');
    if (this.cell.column.frozen) {
      this.element.classList.add('dt-sticky');
    }
    this.element.setAttribute('role', 'gridcell');
    this.element.dataset.columnIndex = this.cell.column.index.toString();
    this.element.dataset.rowIndex = this.cell.rowIndex.toString();
    this.element.tabIndex = -1;

    const cellData = document.createElement('div');
    cellData.classList.add('cell-data');
    cellData.textContent = this.cell.viewValue;
    this.element.append(cellData);
  }

  updateStyles() {
    this.element.style.width = this.cell.column.width + 'px';
    if (this.cell.column.frozen) {
      this.element.style.left = this.cell.column.left + 'px';
    }
    toggleClass(this.element, 'cell-editing', this.editing);
    toggleClass(this.element, 'cell-changed', this.cell.isChanged);
    toggleClass(this.element, 'cell-error', this.cell.hasError);
    const cls = this.cell.row.getCellClass(this.cell.column);
    addClass(this.element, cls);
  }

}
