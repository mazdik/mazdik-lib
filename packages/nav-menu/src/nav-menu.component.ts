import { Listener, isBlank } from '@mazdik-lib/common';
import { TreeNode, Tree } from '@mazdik-lib/tree-lib';
import { NavItem, updateExpandedStyles } from './nav-item';

export class NavMenuComponent extends HTMLElement {

  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
    this.render();
    this.updateStyles();
  }
  minimize: boolean;

  private tree: Tree = new Tree();
  private collapsed: boolean = true;
  private listeners: Listener[] = [];
  private navItems: NavItem[] = [];

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
      fragment.append(element);
    });
    this.append(fragment);
  }

  private createTreeDom(node: TreeNode): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('nav-item');

    const navItem = new NavItem(node);
    this.navItems.push(navItem);
    div.append(navItem.element);

    if (node.hasChildren) {
      const headingChildren = document.createElement('div');
      headingChildren.classList.add('heading-children');
      div.append(headingChildren);
      updateExpandedStyles(node.expanded, headingChildren);

      node.children.forEach(childNode => {
        const dom = this.createTreeDom(childNode);
        headingChildren.append(dom);
      });
    }
    return div;
  }

  private onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const element = target.tagName === 'A' ? target : target.closest('a') as HTMLElement;

    if (element && !isBlank(element.dataset.id)) {
      event.stopPropagation();
      const navItem = this.navItems.find(x => x.node.$$id.toString() === element.dataset.id);
      navItem.onClick();
      this.updateAllItemsStyles();
      if (!isBlank(navItem.node.id)) {
        this.dispatchEvent(new CustomEvent('linkClicked', { detail: navItem.node }));
      }
    }
  }

  updateAllItemsStyles() {
    this.navItems.forEach(x => x.updateStyles());
  }

  ensureVisible(id: string) {
    const node = this.tree.getNodeById(id);
    if (node) {
      node.ensureVisible();
      node.setSelected();
    }
    this.updateAllItemsStyles();
  }

}

customElements.define('web-nav-menu', NavMenuComponent);
