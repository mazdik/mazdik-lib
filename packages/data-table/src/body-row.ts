import { toggleClass, addClass, isBlank } from '@mazdik-lib/common';
import { DataTable, Row } from './base';

export class BodyRow {

  element: HTMLElement;

  constructor(private table: DataTable, private row: Row) {
    this.createRowElements();
    this.updateStyles();
  }

  private createRowElements() {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-body-row');
    this.element.setAttribute('role', 'row');
  }

  updateStyles() {
    this.element.style.height = this.table.dimensions.rowHeight + 'px';

    toggleClass(this.element, 'row-selected', this.isSelected());
    toggleClass(this.element, 'dt-hide', this.rowHeight() === 0);
    const cls = this.row.getRowClass();
    addClass(this.element, cls);
  }

  private isSelected(): boolean {
    return (this.row && !isBlank(this.row.$$index)) ? this.table.selection.isSelected(this.row.$$index) : false;
  }

  private rowHeight(): number {
    if (this.table.settings.rowHeightProp) {
      const rowHeight = this.row[this.table.settings.rowHeightProp];
      return !isBlank(rowHeight) ? rowHeight : this.table.dimensions.rowHeight;
    } else {
      return this.table.dimensions.rowHeight;
    }
  }

}
