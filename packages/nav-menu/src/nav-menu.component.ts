import { Listener, isBlank } from '@mazdik-lib/common';
import { TreeNode, Tree } from '@mazdik-lib/tree-lib';
import './nav-item.component';
import { NavItemComponent, updateExpandedStyles } from './nav-item.component';

export class NavMenuComponent extends HTMLElement {

  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
    this.render();
  }
  minimize: boolean;

  private tree: Tree = new Tree();
  private collapsed: boolean = true;
  private listeners: Listener[] = [];
  private navItems: NavItemComponent[] = [];

  constructor() {
    super();
    this.classList.add('nav-menu');
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'mouseenter',
        target: this,
        handler: this.onMouseEnter.bind(this)
      },
      {
        eventName: 'mouseleave',
        target: this,
        handler: this.onMouseLeave.bind(this)
      },
      {
        eventName: 'click',
        target: this,
        handler: this.onClick.bind(this)
      }
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private updateStyles() {
    if (this.minimize) {
      if (this.collapsed) {
        this.classList.add('nav-collapsed');
        this.classList.remove('nav-expanded');
      } else {
        this.classList.remove('nav-collapsed');
        this.classList.add('nav-expanded');
      }
    } else {
      this.classList.add('nav-expanded');
    }
  }

  private onMouseEnter() {
    this.collapsed = false;
    this.updateStyles();
  }

  private onMouseLeave() {
    this.collapsed = true;
    this.updateStyles();
  }

  private render() {
    const fragment = document.createDocumentFragment();
    this.nodes.forEach(node => {
      const element = this.createTreeDom(node);
      fragment.appendChild(element);
    });
    this.appendChild(fragment);
  }

  private createTreeDom(node: TreeNode): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('nav-item');

    const navItem = document.createElement('web-nav-item') as NavItemComponent;
    navItem.node = node;
    div.appendChild(navItem);
    this.navItems.push(navItem);

    if (node.hasChildren) {
      const headingChildren = document.createElement('div');
      headingChildren.classList.add('heading-children');
      div.appendChild(headingChildren);
      updateExpandedStyles(node.expanded, headingChildren);

      node.children.forEach(childNode => {
        const dom = this.createTreeDom(childNode);
        headingChildren.appendChild(dom);
      });
    }
    return div;
  }

  private onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const element = target.tagName === 'WEB-NAV-ITEM' ? target : target.closest('web-nav-item') as HTMLElement;

    if (element && !isBlank(element.dataset.id)) {
      event.stopPropagation();
      const node = this.getNodeById(element.dataset.id);
      this.onClickNode(node, element as NavItemComponent);
      this.navItems.forEach(x => x.updateStyles());
    }
  }

  private getNodeById(nodeId: string): TreeNode {
    return this.tree.getNodeBy((node) => node.$$id.toString() === nodeId);
  }

  private onClickNode(node: TreeNode, element: NavItemComponent) {
    node.setSelected();
    if (node.hasChildren) {
      node.expanded = !node.expanded;
      const headingChildren = element.nextElementSibling as HTMLElement;
      updateExpandedStyles(node.expanded, headingChildren);
    }
    if (!isBlank(node.id)) {
      this.dispatchEvent(new CustomEvent('linkClicked', { detail: node.id }));
    }
    element.updateStyles();
  }

}

customElements.define('web-nav-menu', NavMenuComponent);
