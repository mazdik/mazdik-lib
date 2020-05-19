import { TreeDataSource, Tree, TreeNode } from '@mazdik-lib/tree-lib';
import { TreeViewNode } from './tree-view-node';

export class TreeViewComponent extends HTMLElement {

  get service(): TreeDataSource { return this.tree.service; }
  set service(val: TreeDataSource) {
    this.tree.service = val;
    this.tree.nodes = [];
  }

  get nodes(): TreeNode[] { return this.tree.nodes; }
  set nodes(val: TreeNode[]) {
    this.tree.nodes = val;
    this.render();
  }

  set serverSideFiltering(val: boolean) {
    this.tree.serverSideFiltering = val;
  }

  //contextMenu: ContextMenuComponent;
  filterDelay = 500;
  getIconFunc: (node?: TreeNode) => string;

  get filterLoading(): boolean {
    return this.tree.filterLoading;
  }

  //@Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  private filterInput: HTMLInputElement;

  tree: Tree = new Tree();
  filterTimeout: any;
  loading: boolean;
  searchFilterText: any = null;

  private treeViewNodes: TreeViewNode[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    this.initGetNodes();
  }

  initGetNodes() {
    this.loading = true;
    this.tree.initLoadNodes().finally(() => { this.loading = false; });
  }

  onFilterKeyup() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.tree.filterTree(this.searchFilterText);
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  onNodeRightClick(event) {
    // if (this.contextMenu) {
    //   this.contextMenu.show({ originalEvent: event.event, data: event.node });
    // }
  }

  collapseAll() {
    this.tree.collapseAll();
  }

  refresh() {
    this.nodes = [];
    this.initGetNodes();
    this.tree.selectedNode = null;
    this.filterInput.value = null;
  }

  onClickClearSearch() {
    this.searchFilterText = null;
    this.onFilterKeyup();
  }

  getNodeById(nodeId: string) {
    return this.tree.getNodeById(nodeId);
  }

  private render() {
    const treeContainer = document.createElement('ul');
    treeContainer.classList.add('tree-container');

    this.nodes.forEach(node => {
      const element = this.createTreeDom(node);
      treeContainer.appendChild(element);
    });
    this.appendChild(treeContainer);
  }

  private createTreeDom(node: TreeNode): HTMLElement {
    const treeViewNode = new TreeViewNode(node);
    if (node.hasChildren) {
      const childrenContainer = document.createElement('ul');
      childrenContainer.classList.add('tree-container');
      treeViewNode.element.appendChild(childrenContainer);
      //updateExpandedStyles(node.expanded, childrenContainer);

      node.children.forEach(childNode => {
        const dom = this.createTreeDom(childNode);
        childrenContainer.appendChild(dom);
      });
    }
    return treeViewNode.element;
  }

}

customElements.define('web-tree-view', TreeViewComponent);
