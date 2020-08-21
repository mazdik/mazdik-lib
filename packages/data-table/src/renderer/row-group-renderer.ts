import { TemplateRenderer, TemplateContext, Row } from '../base';

export class RowGroupRenderer implements TemplateRenderer {

  private elements = new Map<Row, HTMLElement>();

  create(context: TemplateContext): HTMLElement {
    const { table, row } = context;
    const element = document.createElement('div');
    element.classList.add('datatable-body-row', 'datatable-group-header');
    element.style.height = table.dimensions.rowHeight + 'px';

    const cellEl = document.createElement('div');
    cellEl.classList.add('datatable-body-cell', 'dt-sticky');
    cellEl.style.left = '0';
    cellEl.textContent = table.rowGroup.getRowGroupName(row) + ' (' + table.rowGroup.getRowGroupSize(row) + ')';
    element.append(cellEl);

    this.elements.set(row, element);
    return element;
  }

  destroy() {
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

}
