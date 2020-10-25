import { Listener } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell, Row, DataTable, CellEventArgs, CellEventType } from '@mazdik-lib/data-table';

export class CellTreeTotalRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];

  constructor(private columnIndex: number) {}

  create(context: TemplateContext): HTMLElement {
    const { cell, table } = context;

    const element = document.createElement('span');
    element.textContent = this.getSum(cell, table);

    this.addListener({
      eventName: 'cell',
      target: table.events.element,
      handler: this.onCell.bind(this, context)
    });

    this.elements.set(cell, element);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell, table } = context;
    const element = this.elements.get(cell);
    element.textContent = this.getSum(cell, table);
  }

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private getSum(cell: Cell, table: DataTable) {
    if (cell.value) {
      return cell.value;
    }
    const descendants = this.getDescendants(cell.row, table.rows);
    if (descendants && descendants.length) {
      let sum = 0;
      descendants.forEach(x => sum += parseFloat(x[cell.column.name] || 0));
      return sum;
    }
  }

  private getDescendants(row: Row, rows: Row[]) {
    const results = [];
    for (let i = row.$$index + 1; i < rows.length && row.$$level < rows[i].$$level; i++) {
      results.push(rows[i]);
    }
    return results;
  }

  private onCell(context: TemplateContext, event: CustomEvent<CellEventArgs>) {
    const data = event.detail;
    if (data.type === CellEventType.ValueChanged && data.columnIndex === this.columnIndex) {
      this.refresh(context);
    }
  }

}
