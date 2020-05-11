import { TreeNode } from '@mazdik-lib/tree-lib';
import { isBlank, Listener } from '@mazdik-lib/common';

function getTemplate(node: TreeNode, iconClass: string) {
  const icon = iconClass ? `<i class="${iconClass}"></i>` : '';
  return `${icon}
  <span class="menu-item-text">${node.name}</span>
  <div class="rotating-icon">
    <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
    </svg>
  </div>
  `;
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

  set expandedNode(val: TreeNode) {
    if (val && val.$$level === this.node.$$level && val !== this.node) {
      this.node.expanded = false;
    }
  }

  private isRendered: boolean;
  private listeners: Listener[] = [];

  constructor() {
    super();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this,
        handler: this.onClickLink.bind(this)
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

  private onClickLink(event: MouseEvent) {
    event.preventDefault();
    this.node.setSelected();
    if (this.node.hasChildren) {
      this.updateHeadingChildrenStyles();
      this.node.expanded = !this.node.expanded;
      this.dispatchEvent(new CustomEvent('expand', { detail: this.node }));
    }
    if (!isBlank(this.node.id)) {
      this.dispatchEvent(new CustomEvent('linkClicked', { detail: this.node.id }));
    }
    this.updateStyles();
  }

  private render() {
    this.node.expanded = false;
    const iconClass = this.node.icon ? 'nav-menu-icon ' + this.node.icon : '';

    const template = document.createElement('template');
    template.innerHTML = getTemplate(this.node, iconClass);
    this.appendChild(template.content.cloneNode(true));
    this.updateStyles();
  }

  private updateStyles() {
    this.classList.add('vertical-menu-item');
    this.classList.add('level-' + (this.node.$$level + 1));
    if (this.node.expanded) {
      this.classList.add('expanded');
      this.classList.remove('collapsed');
    } else {
      this.classList.remove('expanded');
      this.classList.add('collapsed');
    }
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
  }

  private updateHeadingChildrenStyles() {
    const element = this.nextElementSibling as HTMLElement;
    if (this.node.expanded) {
      element.classList.add('expanded');
      element.classList.remove('collapsed');
    } else {
      element.classList.remove('expanded');
      element.classList.add('collapsed');
    }
  }

}

customElements.define('web-nav-item', NavItemComponent);
