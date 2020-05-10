import { Listener } from '@mazdik-lib/common';
import { TreeNode, Tree } from '@mazdik-lib/tree-lib';
import './nav-item.component';
import { NavItemComponent } from './nav-item.component';

export class NavMenuComponent extends HTMLElement {

  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
    this.render();
  }
  minimize: boolean;

  private tree: Tree = new Tree();
  private expandedNode: TreeNode;
  private collapsed: boolean = true;
  private listeners: Listener[] = [];

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

  private onLinkClicked(event) {
    this.dispatchEvent(new CustomEvent('linkClicked', { detail: event }));
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
      console.log(element);
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

    if (node.hasChildren) {
      const childDiv = document.createElement('div');
      childDiv.classList.add('heading-children');
      div.appendChild(childDiv);

      node.children.forEach(childNode => {
        const dom = this.createTreeDom(childNode);
        childDiv.appendChild(dom);
      });
    }
    return div;
  }

}

customElements.define('web-nav-menu', NavMenuComponent);
