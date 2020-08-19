import { TemplateRenderer, DataTable, Row } from '../base';

export class RowGroupRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];

  create(table: DataTable, row: Row): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('datatable-body-row', 'datatable-group-header');
    element.style.height = table.dimensions.rowHeight + 'px';

    const cellEl = document.createElement('div');
    cellEl.classList.add('datatable-body-cell', 'dt-sticky');
    cellEl.style.left = '0';
    cellEl.textContent = table.rowGroup.getRowGroupName(row) + ' (' + table.rowGroup.getRowGroupSize(row) + ')';
    element.append(cellEl);

    this.elements.push(element);
    return element;
  }

  destroy() {
    this.elements.forEach(x => x.remove());
    this.elements = [];
  }

}
