import { TemplateRenderer, TemplateContext } from '@mazdik-lib/data-table';

export class CellTemplateRenderer implements TemplateRenderer {

  private fragments: DocumentFragment[] = [];

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

    this.fragments.push(fragment);
    return fragment;
  }

  destroy() {
    this.fragments = [];
  }

}
