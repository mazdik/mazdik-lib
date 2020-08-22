import { TemplateRenderer, TemplateContext, Cell } from '../base';

export class CellRowNumberRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();

  create(context: TemplateContext): HTMLElement {
    const { cell } = context;

    const element = document.createElement('div');
    element.classList.add('cell-data');

    this.elements.set(cell, element);
    this.refresh(context);
    return element;
  }

  destroy() {
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell } = context;

    const element = this.elements.get(cell);
    if (element) {
      element.textContent = (cell.row.$$index + 1).toString();
    }
  }

}
