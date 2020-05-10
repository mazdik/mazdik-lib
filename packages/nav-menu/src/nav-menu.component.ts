import { Listener } from '@mazdik-lib/common';
import { TreeNode, Tree } from '@mazdik-lib/tree-lib';
import './nav-item.component';

export class NavMenuComponent extends HTMLElement {

  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
  }
  getIconFunc: (node?: TreeNode) => string;
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

}

customElements.define('web-nav-menu', NavMenuComponent);
