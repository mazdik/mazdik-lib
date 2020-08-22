import { toggleClass, addClass, isBlank } from '@mazdik-lib/common';
import { DataTable, Row, Column, Cell } from './base';

export abstract class BodyCell {

  element: HTMLElement;
  cell: Cell;
  protected editing: boolean;

  constructor(protected table: DataTable, row: Row, column: Column) {
    this.cell = new Cell(row, column);
    this.updateValue();
    this.createCellElement();
    this.updateStyles();
  }

  destroy() {
    if (this.cell.column.cellTemplate) {
      this.cell.column.cellTemplate.destroy();
    }
  }

  private createCellElement() {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-body-cell');
    if (this.cell.column.frozen) {
      this.element.classList.add('dt-sticky');
    }
    this.element.setAttribute('role', 'gridcell');
    this.element.dataset.columnIndex = this.cell.column.index.toString();
    if (!isBlank(this.cell.rowIndex)) {
      this.element.dataset.rowIndex = this.cell.rowIndex.toString();
    }
    this.element.tabIndex = -1;

    if (this.cell.column.cellTemplate) {
      const el = this.cell.column.cellTemplate.create({table: this.table, cell: this.cell});
      this.element.innerHTML = '';
      this.element.append(el);
    } else {
      this.createViewElement();
    }
  }

  protected createViewElement() {
    const cellData = document.createElement('div');
    cellData.classList.add('cell-data');
    cellData.textContent = this.cell.viewValue;
    this.element.innerHTML = '';
    this.element.append(cellData);
  }

  updateStyles() {
    this.element.style.width = this.cell.column.width + 'px';
    if (this.cell.column.frozen) {
      this.element.style.left = this.cell.column.left + 'px';
    }
    toggleClass(this.element, 'cell-editable', this.cell.column.editable);
    toggleClass(this.element, 'cell-editing', this.editing);
    toggleClass(this.element, 'cell-changed', this.cell.isChanged);
    toggleClass(this.element, 'cell-error', this.cell.hasError);
    const cls = this.cell.row.getCellClass(this.cell.column);
    addClass(this.element, cls);

    if (this.cell.column.cellTemplate) {
      this.cell.column.cellTemplate.refresh({ table: this.table, cell: this.cell });
    }
  }

  protected updateValue(): void {
    this.cell.updateViewValue();
    this.cell.validate();
  }

  abstract switchCellToEditMode(): void
  abstract switchCellToViewMode(): void
  abstract onCellKeydown(event: any): void

}
