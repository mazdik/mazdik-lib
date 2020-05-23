import { TreeNode, TreeHelper, FilterState } from '@mazdik-lib/tree-lib';

export function updateExpandedStyles(expanded: boolean, element: HTMLElement) {
  element.style.display = expanded ? 'block' : 'none';
}

export class TreeViewNode {

  element: HTMLElement;
  private expanderIconElement: HTMLElement;
  private nodeContentElement: HTMLElement;
  private iconElement: HTMLElement;

  constructor(public node: TreeNode, private getIconFunc: Function) {
    this.createNodeElement();
    this.updateStyles();
  }

  private createNodeElement() {
    const element = document.createElement('li');
    element.dataset.id = this.node.$$id.toString();

    this.expanderIconElement = document.createElement('i');
    element.appendChild(this.expanderIconElement);

    this.nodeContentElement = document.createElement('span');

    this.iconElement = document.createElement('i');
    this.nodeContentElement.appendChild(this.iconElement);

    const text = document.createTextNode(this.node.name);
    this.nodeContentElement.appendChild(text);
    element.appendChild(this.nodeContentElement);

    this.element = element;
  }

  private getIcon() {
    return this.getIconFunc ? this.getIconFunc(this.node) : this.node.icon;
  }

  private getExpanderIcon() {
    return TreeHelper.getExpanderIcon(this.node);
  }

  private nodeClass(): string {
    let cls = 'treenode';
    if (this.node.$$filterState === FilterState.NOT_FOUND) {
      cls += ' filter-not-found';
    }
    return cls;
  }

  private nodeContentClass(): string {
    let cls = 'treenode-content';
    if (this.node.$$filterState === FilterState.FOUND) {
      cls += ' filter-found';
    } else if (this.node.$$filterState === FilterState.ON_FOUND_PATH) {
      cls += ' filter-on-path';
    }
    if (this.node.isSelected) {
      cls += ' highlight';
    }
    return cls;
  }

  updateStyles() {
    this.element.className = this.nodeClass();
    this.expanderIconElement.className = this.getExpanderIcon();
    this.nodeContentElement.className = this.nodeContentClass();
    this.iconElement.className = this.getIcon();

    const childrenContainer = this.nodeContentElement.nextElementSibling as HTMLElement;
    if (childrenContainer) {
      updateExpandedStyles(this.node.expanded, childrenContainer);
    }
  }

}
