import { Listener } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell, CellEventType, CellEventArgs } from '@mazdik-lib/data-table';

export class CellMultiSelectRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];
  private editing = {};

  constructor(private onClickFunc: (event: Event, context: TemplateContext) => void) {}

  create(context: TemplateContext): HTMLElement {
    const { cell, table } = context;
    const element = document.createElement('span');
    element.classList.add('view-data');
    element.textContent = cell.viewValue;

    this.addListener({
      eventName: 'cell',
      target: table.events.element,
      handler: this.onCell.bind(this, context)
    });

    this.elements.set(cell, element);
    this.refresh(context);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell } = context;
    const element = this.elements.get(cell);
    if (element) {
      element.style.display = this.editing[cell.rowIndex] ? 'none' : 'block';
    }
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

  private onCell(context: TemplateContext, event: CustomEvent<CellEventArgs>) {
    const data = event.detail;
    Object.keys(this.editing).forEach(x => this.editing[x] = false);
    if (data.type === CellEventType.Click && data.columnIndex === 3) {
      this.editing[data.rowIndex] = true;
    }
  }

}
