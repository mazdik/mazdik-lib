import { Listener, toggleClass } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell } from '@mazdik-lib/data-table';

export class CellActionRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];

  create(context: TemplateContext): HTMLElement {
    const { table, cell } = context;
    const element = document.createElement('button');
    element.classList.add('dt-button-actions');

    const icon = document.createElement('i');
    icon.classList.add('dt-icon-actions');
    element.append(icon);

    this.addListener({
      eventName: 'click',
      target: element,
      handler: this.onRowMenuClick.bind(this, context)
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
    const { table, cell } = context;
    const element = this.elements.get(cell);
    if (element) {
      const changed = table.rowChanged(cell.row);
      toggleClass(element, 'cell-changed', changed);
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

  private onRowMenuClick(context: TemplateContext) {
    const { table, cell } = context;
    console.log(cell);
    // table.events.emitCheckbox(cell.row);
  }

}
