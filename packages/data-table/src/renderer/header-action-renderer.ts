import { Listener } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, DataTable, Column } from '../base';

export class HeaderActionRenderer implements TemplateRenderer {

  private elements = new Map<Column, HTMLElement>();
  private listeners: Listener[] = [];

  create(context: TemplateContext): HTMLElement {
    const { table, column } = context;

    const element = document.createElement('button');
    element.classList.add('filter-action');
    element.title = table.messages.clearFilters;

    const icon = document.createElement('i');
    icon.classList.add('dt-icon-filter');
    element.append(icon);

    this.addListener({
      eventName: 'click',
      target: element,
      handler: this.clearAllFilters.bind(this, table)
    });

    this.elements.set(column, element);
    this.refresh(context);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { table, column } = context;
    const element = this.elements.get(column);
    if (element) {
      element.style.visibility = (!table.dataFilter.hasFilters()) ? 'hidden' : 'visible';
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

  private clearAllFilters(table: DataTable) {
    table.dataFilter.clear();
    table.events.emitFilter();
  }

}
