import { TreeNode, TreeHelper, FilterState } from '@mazdik-lib/tree-lib';

// @Component({
//   selector: 'app-tree-view-node',
//   template: `
//     <li *ngIf="node" [ngClass]="nodeClass()">
//       <i [ngClass]="getExpanderIcon(node)"
//          (click)="onExpand(node)">
//       </i>
//       <span [ngClass]="nodeContentClass()"
//             (click)="onSelectNode(node)"
//             (dblclick)="onExpand(node)"
//             (contextmenu)="onNodeRightClick($event)">
//         <i *ngIf="node.icon || getIconFunc" [ngClass]="getIcon(node)"></i>
//         {{node.name}}
//       </span>
//       <ul class="tree-container" *ngIf="node.hasChildren && node.expanded">
//         <app-tree-view-node
//           *ngFor="let childNode of node.children"
//           [node]="childNode"
//           [getIconFunc]="getIconFunc"
//           (selectedChanged)="selectedChanged.emit($event)"
//           (nodeRightClick)="nodeRightClick.emit($event)">
//         </app-tree-view-node>
//       </ul>
//     </li>
//   `
// })
export class TreeViewNode {

  element: HTMLElement

  constructor(public node: TreeNode) {
    this.element = this.createNodeElement();
  }

  private getTemplate() {
    const icon = this.node.icon ? `<i class="${this.node.icon}"></i>` : '';
    const innerContent = icon + this.node.name;
    const template = `
    <i class="${this.getExpanderIcon()}"></i>
    <span class="${this.nodeContentClass()}">${innerContent}</span>`;
    return template;
  }

  private createNodeElement(): HTMLElement {
    const element = document.createElement('li');
    element.innerHTML = this.getTemplate();
    element.dataset.id = this.node.$$id.toString();
    //this.updateNavItemStyles(node, element);
    return element;
  }

  //@Output() selectedChanged: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
  //@Output() nodeRightClick: EventEmitter<any> = new EventEmitter();

  onSelectNode() {
    if (this.node.tree.selectedNode !== this.node) {
      this.node.tree.selectedNode = this.node;
      //this.selectedChanged.emit(this.node);
    }
  }

  onExpand() {
    this.node.expanded = !this.node.expanded;
    if (this.node.expanded) {
      this.node.$$loading = true;
      this.node.tree.loadNode(this.node).finally(() => { this.node.$$loading = false; });
    }
  }

  getExpanderIcon() {
    return TreeHelper.getExpanderIcon(this.node);
  }

  nodeClass(): string {
    let cls = 'treenode';
    if (this.node.$$filterState === FilterState.NOT_FOUND) {
      cls += ' filter-not-found';
    }
    return cls;
  }

  nodeContentClass(): string {
    let cls = 'treenode-content';
    if (this.node.$$filterState === FilterState.FOUND) {
      cls += ' filter-found';
    } else if (this.node.$$filterState === FilterState.ON_FOUND_PATH) {
      cls += ' filter-on-path';
    }
    if (this.node.isSelected) {
      cls += ' highlight';
    }
    return cls;
  }

  onNodeRightClick(event: MouseEvent) {
    this.onSelectNode();
    //this.nodeRightClick.emit({ event, node: this.node });
  }

}
