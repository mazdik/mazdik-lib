import { TreeDataSource, Tree, TreeNode } from '@mazdik-lib/tree-lib';
import { Listener, isBlank } from '@mazdik-lib/common';
import { TreeViewNode, updateExpandedStyles } from './tree-view-node';

function getTemplate(id: string) {
  return `
<div class="tree-header">
  <i class="dt-tree-icon dt-icon-shrink large" id="collapseAllIcon${id}"></i>
  <i class="dt-tree-icon dt-icon-reload large" id="refreshIcon${id}"></i>
  <div class="dt-clearable-input tree-filter-input">
    <input class="dt-input" id="filterInput${id}">
    <span class="dt-loader dt-tree-filter-loading" id="filterLoading${id}"></span>
    <span id="clearSearchIcon${id}">&times;</span>
  </div>
</div>
<div class="tree-body">
  <div id="loadingIcon${id}" class="tree-loading-content"><i class="dt-loader"></i></div>
  <ul class="tree-container" id="treeContainer${id}" style="padding-left: 0;"></ul>
</div>
  `;
}

export class TreeViewComponent extends HTMLElement {

  filterDelay = 500;
  getIconFunc: (node?: TreeNode) => string;

  get service(): TreeDataSource { return this.tree.service; }
  set service(val: TreeDataSource) {
    this.tree.service = val;
    this.tree.nodes = [];
    this.initGetNodes();
  }

  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
    this.tree.filterLoadingFunc = this.updateFilterLoadingStyles.bind(this);
  }

  tree: Tree = new Tree();
  private filterTimeout: any;

  private listeners: Listener[] = [];
  private treeViewNodes: TreeViewNode[] = [];
  private treeContainer: HTMLElement;
  private loadingIcon: HTMLElement;
  private filterInput: HTMLInputElement;
  private filterLoading: HTMLElement;
  private clearSearchIcon: HTMLElement;
  private collapseAllIcon: HTMLElement;
  private refreshIcon: HTMLElement;

  constructor() {
    super();
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.treeContainer = this.querySelector('#treeContainer'+id);
    this.loadingIcon = this.querySelector('#loadingIcon'+id);
    this.filterInput = this.querySelector('#filterInput'+id);
    this.filterLoading = this.querySelector('#filterLoading'+id);
    this.clearSearchIcon = this.querySelector('#clearSearchIcon'+id);
    this.collapseAllIcon = this.querySelector('#collapseAllIcon'+id);
    this.refreshIcon = this.querySelector('#refreshIcon'+id);

    this.loading(false);
    this.filterInput.placeholder = 'Search';
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
        handler: this.onClick.bind(this)
      },
      {
        eventName: 'dblclick',
        target: this,
        handler: this.onDblClick.bind(this)
      },
      {
        eventName: 'contextmenu',
        target: this,
        handler: this.onContextMenu.bind(this)
      },
      {
        eventName: 'input',
        target: this.filterInput,
        handler: this.onInputFilter.bind(this)
      },
      {
        eventName: 'click',
        target: this.clearSearchIcon,
        handler: this.onClickClearSearch.bind(this)
      },
      {
        eventName: 'click',
        target: this.collapseAllIcon,
        handler: this.collapseAll.bind(this)
      },
      {
        eventName: 'click',
        target: this.refreshIcon,
        handler: this.refresh.bind(this)
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

  private initGetNodes() {
    this.loading(true);
    this.tree.initLoadNodes().then(() => {
      this.render();
    }).finally(() => {
      this.loading(false);
    });
  }

  private loading(val: boolean) {
    this.loadingIcon.style.display = val ? 'block' : 'none';
  }

  private render() {
    const fragment = document.createDocumentFragment();
    this.tree.nodes.forEach(node => {
      const element = this.createTreeDom(node);
      fragment.appendChild(element);
    });
    this.treeContainer.innerHTML = '';
    this.treeContainer.appendChild(fragment);
  }

  private createTreeDom(node: TreeNode, viewNode?: TreeViewNode): HTMLElement {
    const treeViewNode = viewNode ? viewNode : new TreeViewNode(node, this.getIconFunc);
    this.treeViewNodes.push(treeViewNode);
    if (node.hasChildren) {
      const childrenContainer = document.createElement('ul');
      childrenContainer.classList.add('tree-container');
      treeViewNode.element.appendChild(childrenContainer);
      updateExpandedStyles(node.expanded, childrenContainer);

      node.children.forEach(childNode => {
        const dom = this.createTreeDom(childNode);
        childrenContainer.appendChild(dom);
      });
    }
    return treeViewNode.element;
  }

  updateAllItemsStyles() {
    this.treeViewNodes.forEach(x => x.updateStyles());
  }

  private updateClearSearchIconStyles() {
    this.clearSearchIcon.style.display = (this.filterInput.value.length > 0 && !this.tree.filterLoading) ? 'block' : 'none';
  }

  private updateFilterLoadingStyles(state) {
    this.updateClearSearchIconStyles();
    this.filterLoading.style.display = state ? 'block' : 'none';
  }

  private onExpand(treeViewNode: TreeViewNode) {
    const node = treeViewNode.node;
    const needCreateElements = this.needCreateElements(node);
    node.expanded = !node.expanded;
    if (node.expanded) {
      node.$$loading = true;
      treeViewNode.updateStyles();
      node.tree.loadNode(node).then(() => {
        if (needCreateElements) {
          this.createTreeDom(treeViewNode.node, treeViewNode);
        }
      }).finally(() => {
        node.$$loading = false;
        treeViewNode.updateStyles();
      });
    }
    this.updateAllItemsStyles();
  }

  private needCreateElements(node: TreeNode): boolean {
    if (!node.hasChildren) {
      return true;
    }
    // for server side filtering
    const existsCreatedChildrenElements = node.children.some(childNode => {
      return this.treeViewNodes.find(x => x.node.$$id === childNode.$$id);
    });
    return !existsCreatedChildrenElements;
  }

  private getTreeViewNode(event: MouseEvent, className: string): TreeViewNode {
    const target = event.target as HTMLElement;
    const element = target.classList.contains(className) ? target : target.closest('.' + className) as HTMLElement;
    if (element && element.parentElement) {
      const id = element.parentElement.dataset.id;
      if (isBlank(id)) {
        return;
      }
      event.stopPropagation();
      const treeViewNode = this.treeViewNodes.find(x => x.node.$$id.toString() === id);
      return treeViewNode;
    }
  }

  private onClick(event: MouseEvent) {
    this.onClickTreenodeContent(event);
    this.onClickExpanderIcon(event);
  }

  private onClickTreenodeContent(event: MouseEvent) {
    const treeViewNode = this.getTreeViewNode(event, 'treenode-content');
    if (treeViewNode) {
      treeViewNode.node.setSelected();
      this.updateAllItemsStyles();
      this.dispatchEvent(new CustomEvent('selectedChanged', { detail: treeViewNode.node }));
    }
  }

  private onClickExpanderIcon(event: MouseEvent) {
    const treeViewNode = this.getTreeViewNode(event, 'dt-icon-node');
    if (treeViewNode) {
      this.onExpand(treeViewNode);
    }
  }

  private onDblClick(event: MouseEvent) {
    const treeViewNode = this.getTreeViewNode(event, 'treenode-content');
    if (treeViewNode) {
      this.onExpand(treeViewNode);
    }
  }

  private onContextMenu(event: MouseEvent) {
    const treeViewNode = this.getTreeViewNode(event, 'treenode-content');
    if (treeViewNode) {
      treeViewNode.node.setSelected();
      this.updateAllItemsStyles();
      this.dispatchEvent(new CustomEvent('selectedChanged', { detail: treeViewNode.node }));
      const data = {originalEvent: event, data: treeViewNode.node};
      this.dispatchEvent(new CustomEvent('nodeRightClick', {detail: data}));
    }
  }

  private onInputFilter() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this.updateClearSearchIconStyles();
      this.tree.filterTree(this.filterInput.value).then(() => {
        this.updateAllItemsStyles();
      });
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  private onClickClearSearch() {
    this.filterInput.value = '';
    this.updateClearSearchIconStyles();
    this.tree.filterTree(this.filterInput.value).then(() => {
      this.updateAllItemsStyles();
    });
  }

  collapseAll() {
    this.tree.collapseAll();
    this.updateAllItemsStyles();
  }

  refresh() {
    this.tree.nodes = [];
    this.initGetNodes();
    this.tree.selectedNode = null;
    this.filterInput.value = null;
  }

}

customElements.define('web-tree-view', TreeViewComponent);
