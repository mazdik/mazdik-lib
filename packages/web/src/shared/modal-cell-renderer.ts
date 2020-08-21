import { TemplateRenderer, TemplateContext, Cell } from '@mazdik-lib/data-table';
import { Listener } from '@mazdik-lib/common';

export class ModalCellRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];

  constructor(private onClickFunc: (value) => void) {}

  create(context: TemplateContext): HTMLElement {
    const { cell } = context;

    const element = document.createElement('a');
    element.href = '#';
    element.textContent = cell.viewValue;

    this.addListener({
      eventName: 'click',
      target: element,
      handler: this.onClickCell.bind(this, cell)
    });

    this.elements.set(cell, element);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.clear();
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

  onClickCell(cell: Cell, event: MouseEvent) {
    event.preventDefault();
    this.onClickFunc(cell);
  }

}
