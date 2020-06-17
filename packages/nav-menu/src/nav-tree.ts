import { NavTreeNode } from './nav-tree-node';

export class NavTree {

  selectedNode: NavTreeNode;

  get nodes(): NavTreeNode[] { return this._nodes; }
  set nodes(val: NavTreeNode[]) {
    this._nodes = [];
    for (const node of val) {
      this._nodes.push(new NavTreeNode(node, null, this));
    }
  }
  private _nodes: NavTreeNode[];

  private uidNode: number = 0;

  generateId(): number {
    return this.uidNode++;
  }

}
