import { Listener } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell } from '../base';

export class CellCheckboxRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];

  create(context: TemplateContext): HTMLElement {
    const { table, cell } = context;
    const element = document.createElement('span');
    element.classList.add('dt-' + table.settings.selectionMode);

    const input = document.createElement('input');
    input.type = table.settings.selectionMode;
    element.append(input);
    this.refresh(context);

    this.addListener({
      eventName: 'click',
      target: input,
      handler: this.onCheckboxClick.bind(this, context)
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
    const { table, cell } = context;
    const element = this.elements.get(cell);
    if (element) {
      const input = element.children[0] as HTMLInputElement;
      input.checked = table.selection.isSelected(cell.row.$$index);
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

  private onCheckboxClick(context: TemplateContext) {
    const { table, cell } = context;
    table.selection.toggle(cell.row.$$index);
    table.events.emitCheckbox(cell.row);
  }

}
