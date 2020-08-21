import { TemplateRenderer, TemplateContext, Cell } from '../base';

export class CellRowNumberRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();

  create(context: TemplateContext): HTMLElement {
    const { cell } = context;

    const element = document.createElement('div');
    element.classList.add('cell-data');
    element.textContent = (cell.row.$$index + 1).toString();

    this.elements.set(cell, element);
    return element;
  }

  destroy() {
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

}
