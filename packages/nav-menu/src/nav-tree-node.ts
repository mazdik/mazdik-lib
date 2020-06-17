export class NavTreeNode {
  id: string;
  name: string;
  data?: any;
  icon?: string;
  expanded?: boolean;
  parent?: NavTreeNode;

  get children(): NavTreeNode[] { return this._children; }
  set children(val: NavTreeNode[]) {
    this._children = val ? val.map((c) => new NavTreeNode(c, this, this.tree)) : [];
  }
  private _children: NavTreeNode[];

  $$id?: number;
  $$level?: number;

  constructor(init: Partial<NavTreeNode>, parentNode: NavTreeNode, public tree: any) {
    this.id = init.id;
    this.name = init.name;
    this.data = init.data;
    this.icon = init.icon;
    this.expanded = init.expanded;
    this.parent = parentNode;

    this.$$id = this.tree.generateId();
    this.$$level = (parentNode) ? parentNode.$$level + 1 : 0;

    this.children = init.children;
  }

  get hasChildren(): boolean {
    return (this.children && this.children.length > 0);
  }

  get isSelected() {
    return this === this.tree.selectedNode;
  }

  setSelected() {
    this.tree.selectedNode = this;
  }

  ensureVisible() {
    if (this.parent) {
      this.parent.expanded = true;
      this.parent.ensureVisible();
    }
    return this;
  }

}
