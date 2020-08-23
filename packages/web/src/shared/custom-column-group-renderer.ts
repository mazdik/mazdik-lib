import { TemplateRenderer, TemplateContext, DataTable } from '@mazdik-lib/data-table';

export class CustomColumnGroupRenderer implements TemplateRenderer {

  private elements = new Map<number[], HTMLElement>();

  create(context: TemplateContext): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('datatable-header-row');

    const el = this.createElement(element, 'Group 1', [0, 2]);
    el.classList.add('dt-sticky');
    el.style.left = '0';
    this.createElement(element, 'Group 2', [2, 5]);
    this.createElement(element, 'Group 3', [5, 8]);
    this.createElement(element, 'Group 4', [8, 12]);
    this.createElement(element, 'Group 5', [12, 17]);

    this.refresh(context);
    return element;
  }

  destroy() {
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { table } = context;

    this.elements.forEach((element, key) => {
      element.style.width = this.getWidth(table, key[0], key[1]) + 'px';
    });
  }

  private createElement(parent: HTMLElement, title: string, interval: number[]): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('datatable-header-cell');
    element.textContent = title;
    parent.append(element);

    this.elements.set(interval, element);
    return element;
  }

  private getWidth(table: DataTable, from: number, to: number) {
    let width = 0;
    for (let index = from; index < to; index++) {
      width += table.columns[index].width;
    }
    return width;
  }

}
