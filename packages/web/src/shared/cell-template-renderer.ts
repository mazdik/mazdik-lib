import { TemplateRenderer, TemplateContext, Cell } from '@mazdik-lib/data-table';

export class CellTemplateRenderer implements TemplateRenderer {

  private elements = new Map<Cell, DocumentFragment>();

  create(context: TemplateContext): DocumentFragment {
    const { cell } = context;

    const fragment = document.createDocumentFragment();
    const img = document.createElement('img');
    img.classList.add('dt-template-demo-img');
    img.src = cell.value === 'ASMODIANS' ? 'assets/asmodian.png' : 'assets/elyos.png';
    img.title = cell.viewValue;
    fragment.append(img);
    const text = document.createTextNode(cell.viewValue);
    fragment.append(text);

    this.elements.set(cell, fragment);
    return fragment;
  }

  destroy() {
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell } = context;
    const element = this.elements.get(cell);
  }

}
