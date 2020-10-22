import { Listener } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell, Row } from '@mazdik-lib/data-table';
import { TreeNode, TreeHelper } from '@mazdik-lib/tree-lib';

export class CellTreeNodeRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private contentIcons = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];
  private indent: number = 10;

  constructor(private getIconFunc: (node?: TreeNode) => string, private onExpandFunc: (node: TreeNode) => void) { }

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

    const text = document.createTextNode(cell.row['node']['name']);
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
      element.firstElementChild.className = this.getExpanderIcon(cell.row['node']);
    }
    const contentIcon = this.contentIcons.get(cell);
    contentIcon.className = this.getIcon(cell.row['node']);
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

  private getExpanderIcon(node: TreeNode) {
    return TreeHelper.getExpanderIcon(node);
  }

  private getIcon(node: TreeNode) {
    if (this.getIconFunc) {
      return this.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

  private paddingIndent(row: Row): number {
    return row.$$level * this.indent;
  }

  private onExpand(context: TemplateContext) {
    const { cell } = context;
    cell.row['node'].$$loading = true;
    this.refresh(context);
    this.onExpandFunc(cell.row['node']);
  }

}
