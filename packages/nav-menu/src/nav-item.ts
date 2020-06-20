import { toggleClass } from '@mazdik-lib/common';
import { NavTreeNode } from './nav-tree-node';

export function updateExpandedStyles(expanded: boolean, element: HTMLElement) {
  toggleClass(element, 'expanded', expanded);
  toggleClass(element, 'collapsed', !expanded);
}

export class NavItem {

  element: HTMLElement

  constructor(public node: NavTreeNode) {
    this.element = this.createNavItemElement(node);
  }

  private getTemplate(name: string, iconClass: string, hasChildren: boolean) {
    const rotatingIcon = `<div class="rotating-icon">
      <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
      </svg>
    </div>`;
    const icon = iconClass ? `<i class="${iconClass}"></i>` : '';
    const rotating = hasChildren ? rotatingIcon : '';
    return `${icon}<span class="menu-item-text">${name}</span>${rotating}`;
  }

  private createNavItemElement(node: NavTreeNode): HTMLElement {
    const iconClass = node.icon ? 'nav-menu-icon ' + node.icon : '';
    const element = document.createElement('a');
    element.innerHTML = this.getTemplate(node.name, iconClass, node.hasChildren);
    element.dataset.id = node.$$id.toString();
    element.classList.add('vertical-menu-item');
    element.classList.add('level-' + (this.node.$$level + 1));
    this.updateNavItemStyles(node, element);
    return element;
  }

  private updateNavItemStyles(node: NavTreeNode, element: HTMLElement) {
    toggleClass(element, 'active', node.isSelected);
    toggleClass(element, 'heading', node.hasChildren);
    updateExpandedStyles(node.expanded, element);
  }

  updateStyles() {
    this.updateNavItemStyles(this.node, this.element);
    const headingChildren = this.element.nextElementSibling as HTMLElement;
    if (headingChildren) {
      updateExpandedStyles(this.node.expanded, headingChildren);
    }
  }

  onClick() {
    if (this.node.hasChildren) {
      this.node.expanded = !this.node.expanded;
    } else {
      this.node.setSelected();
    }
    this.updateStyles();
  }

}
