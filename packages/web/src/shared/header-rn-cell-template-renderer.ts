import { DataTable, TemplateRenderer, TemplateContext } from '@mazdik-lib/data-table';
import { Listener } from '@mazdik-lib/common';

export class HeaderRnCellTemplateRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];
  private listeners: Listener[] = [];

  create(context: TemplateContext): HTMLElement {
    const { table } = context;

    const element = document.createElement('button');
    element.classList.add('filter-action');
    element.title = table.messages.clearFilters;
    element.style.visibility = (!table.dataFilter.hasFilters()) ? 'hidden' : 'visible';

    const icon = document.createElement('i');
    icon.classList.add('dt-icon-filter');
    element.append(icon);

    this.addListener({
      eventName: 'click',
      target: element,
      handler: this.clearAllFilters.bind(this, table, null)
    });

    this.elements.push(element);
    return element;
  }

  destroy() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
    this.elements.forEach(x => x.remove());
    this.elements = [];
  }

  refresh(context: TemplateContext) {
    const { table } = context;

    this.elements.forEach(element => {
      element.style.visibility = (!table.dataFilter.hasFilters()) ? 'hidden' : 'visible';
    });
  }

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private clearAllFilters(table: DataTable) {
    table.dataFilter.clear();
    table.events.emitFilter();
  }

}
