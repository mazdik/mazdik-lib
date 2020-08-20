import { TemplateRenderer, TemplateContext } from '@mazdik-lib/data-table';

export class RnCellTemplateRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];

  create(context: TemplateContext): HTMLElement {
    const { cell } = context;

    const element = document.createElement('div');
    element.classList.add('cell-data');
    element.textContent = (cell.row.$$index + 1).toString();

    this.elements.push(element);
    return element;
  }

  destroy() {
    this.elements.forEach(x => x.remove());
    this.elements = [];
  }

}
