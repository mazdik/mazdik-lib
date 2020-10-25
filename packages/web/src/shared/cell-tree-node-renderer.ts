import { Listener } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell, Row } from '@mazdik-lib/data-table';

export class CellTreeNodeRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private contentIcons = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];
  private indent: number = 10;

  constructor(
    private getIconFunc: (row: any) => string,
    private getExpanderIconFunc: (row: any) => string,
    private onExpandFunc: (row: any) => void,
  ) { }

  create(context: TemplateContext): HTMLElement {
    const { cell } = context;
    const element = document.createElement('div');
    element.classList.add('datatable-tree-node');

    const icon = document.createElement('i');
    element.append(icon);

    const content = document.createElement('span');
    content.classList.add('datatable-tree-node-content');
    element.append(content);

    const contentIcon = document.createElement('i');
    content.append(contentIcon);

    const text = document.createTextNode(cell.row['name']);
    content.append(text);

    this.addListener({
      eventName: 'click',
      target: icon,
      handler: this.onExpand.bind(this, context)
    });
    this.addListener({
      eventName: 'dblclick',
      target: content,
      handler: this.onExpand.bind(this, context)
    });

    this.elements.set(cell, element);
    this.contentIcons.set(cell, contentIcon);
    this.refresh(context);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell } = context;
    const element = this.elements.get(cell);
    if (element) {
      element.style.paddingLeft = this.paddingIndent(cell.row) + 'px';
      element.firstElementChild.className = this.getExpanderIcon(cell.row);
    }
    const contentIcon = this.contentIcons.get(cell);
    contentIcon.className = this.getIcon(cell.row);
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

  private getExpanderIcon(row: any) {
    return this.getExpanderIconFunc ? this.getExpanderIconFunc(row) : '';
  }

  private getIcon(row: any) {
    return this.getIconFunc ? this.getIconFunc(row) : '';
  }

  private paddingIndent(row: Row): number {
    return row.$$level * this.indent;
  }

  private onExpand(context: TemplateContext) {
    const { cell } = context;
    this.onExpandFunc(cell.row);
    this.refresh(context);
  }

}
