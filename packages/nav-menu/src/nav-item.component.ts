import { TreeNode } from '@mazdik-lib/tree-lib';
import { isBlank } from '@mazdik-lib/common';

function getTemplate(node: TreeNode, nodeIcon: string) {
  const icon = nodeIcon ? `<i class="${nodeIcon}"></i>` : '';
  return `
  <a class="vertical-menu-item heading" [ngClass]="classes" (click)="onClickHeader($event)">${icon}
    <span class="menu-item-text">${node.name}</span>
    <div class="rotating-icon">
      <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
      </svg>
    </div>
  </a>
  `;
}

export class NavItemComponent extends HTMLElement {

  node: TreeNode;
  set expandedNode(val: TreeNode) {
    if (val && val.$$level === this.node.$$level && val !== this.node) {
      this.node.expanded = false;
    }
  }
  getIconFunc: (node?: TreeNode) => string;

  constructor() {
    super();
    this.classList.add('nav-item');
  }

  get classes() {
    return {
      ['level-' + (this.node.$$level + 1)]: true,
      collapsed: !this.node.expanded,
      expanded: this.node.expanded,
      active: this.node.isSelected
    };
  }

  get headingChildrenClasses() {
    return {
      collapsed: !this.node.expanded,
      expanded: this.node.expanded
    };
  }

  getIcon(node: TreeNode) {
    if (this.getIconFunc) {
      return this.getIconFunc(node);
    } else {
      return node.icon;
    }
  }

  onClickHeader(event: MouseEvent) {
    event.preventDefault();
    this.node.expanded = !this.node.expanded;
    this.dispatchEvent(new CustomEvent('expand', { detail: this.node }));
    if (!isBlank(this.node.id)) {
      this.dispatchEvent(new CustomEvent('linkClicked', { detail: this.node.id }));
    }
  }

  onClickLink(event: MouseEvent) {
    event.preventDefault();
    this.node.setSelected();
    this.dispatchEvent(new CustomEvent('linkClicked', { detail: this.node.id }));
  }

  private render() {
    const nodeIcon = (this.node.icon || this.getIconFunc) ? 'nav-menu-icon ' + this.getIcon(this.node) : '';
    // TODO
  }

}

customElements.define('web-nav-item', NavItemComponent);
