import { TreeNode } from '@mazdik-lib/tree-lib';

export function updateExpandedStyles(expanded: boolean, element: HTMLElement) {
  if (expanded) {
    element.classList.add('expanded');
    element.classList.remove('collapsed');
  } else {
    element.classList.remove('expanded');
    element.classList.add('collapsed');
  }
}

function getTemplate(name: string, iconClass: string, hasChildren: boolean) {
  const rotatingIcon = `<div class="rotating-icon">
    <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
    </svg>
  </div>`;
  const icon = iconClass ? `<i class="${iconClass}"></i>` : '';
  const rotating = hasChildren ? rotatingIcon : '';
  return `${icon}<span class="menu-item-text">${name}</span>${rotating}`;
}

export class NavItemComponent extends HTMLElement {

  get node(): TreeNode { return this._node; }
  set node(val: TreeNode) {
    this._node = val;
    if (!this.isRendered) {
      this.render();
      this.isRendered = true;
    }
  }
  private _node: TreeNode;

  private isRendered: boolean;

  constructor() {
    super();
  }

  private render() {
    const iconClass = this.node.icon ? 'nav-menu-icon ' + this.node.icon : '';
    const template = document.createElement('template');
    template.innerHTML = getTemplate(this.node.name, iconClass, this.node.hasChildren);
    this.appendChild(template.content.cloneNode(true));
    this.updateStyles();
    this.dataset.id = this.node.$$id.toString();
  }

  updateStyles() {
    this.classList.add('vertical-menu-item');
    this.classList.add('level-' + (this.node.$$level + 1));
    if (this.node.isSelected) {
      this.classList.add('active');
    } else {
      this.classList.remove('active');
    }
    if (this.node.hasChildren) {
      this.classList.add('heading');
    } else {
      this.classList.add('heading');
    }
    updateExpandedStyles(this.node.expanded, this);
  }

}

customElements.define('web-nav-item', NavItemComponent);
