import { DataTable, TemplateRenderer, TemplateContext, Row } from '@mazdik-lib/data-table';
import { Listener } from '@mazdik-lib/common';

export class CustomRowGroupRenderer implements TemplateRenderer {

  private elements = new Map<Row, HTMLElement>();
  private listeners: Listener[] = [];

  create(context: TemplateContext): HTMLElement {
    const { table, row } = context;
    const element = document.createElement('div');
    element.classList.add('datatable-body-row', 'datatable-group-header');
    element.style.height = table.dimensions.rowHeight + 'px';

    const cellEl = this.createCellElement(table, row);
    element.append(cellEl);

    this.elements.set(row, element);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private createCellElement(table: DataTable, row: any) {
    const cellEl = document.createElement('div');
    cellEl.classList.add('datatable-body-cell', 'dt-sticky', 'pointer');
    cellEl.style.left = '0';

    const iconElement = document.createElement('i');
    iconElement.className = (!row.expanded) ? 'dt-icon-node dt-icon-collapsed' : 'dt-icon-node';
    cellEl.append(iconElement);

    const text = table.rowGroup.getRowGroupName(row) + ' (' + table.rowGroup.getRowGroupSize(row) + ')';
    const textElement = document.createTextNode(text);
    cellEl.append(textElement);

    const listener = {
      eventName: 'click',
      target: cellEl,
      handler: this.onExpanded.bind(this, table, row)
    };
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);

    return cellEl;
  }

  private onExpanded(table: DataTable, row: any) {
    row.expanded = !row.expanded;
    if (!row.expanded) {
      const descendants = table.rowGroup.getGroupRows(row, table.rows);
      descendants.forEach(x => x.$$height = 0);
    } else {
      const descendants = table.rowGroup.getGroupRows(row, table.rows);
      descendants.forEach(x => x.$$height = null);
    }
    table.events.emitUpdateStyles();
  }

}
