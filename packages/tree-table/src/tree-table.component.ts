import { Listener } from '@mazdik-lib/common';
import '@mazdik-lib/data-table';
import { TreeTable } from './tree-table';
import { DataTableComponent } from '@mazdik-lib/data-table';
import { TreeNode } from '@mazdik-lib/tree-lib';
import { CellTreeNodeRenderer } from './cell-tree-node-renderer';

export class TreeTableComponent extends HTMLElement {

  get treeTable(): TreeTable { return this._treeTable; }
  set treeTable(val: TreeTable) {
    this._treeTable = val;
    this.initLoad();
    this.addEventListeners();
  }
  private _treeTable: TreeTable;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private dt: DataTableComponent;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    this.dt = document.createElement('web-data-table') as DataTableComponent;
    this.append(this.dt);
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'checkbox',
        target: this.treeTable.events.element,
        handler: this.onCheckbox.bind(this)
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

  private initLoad() {
    const index = this.treeTable.settings.selectionMode ? 1 : 0;
    const cellRenderer = new CellTreeNodeRenderer(this.treeTable.getIconFunc, this.onExpand.bind(this));
    this.treeTable.columns[index].cellTemplate = cellRenderer;
    this.dt.table = this.treeTable;
    this.initGetNodes();
  }

  private initGetNodes() {
    this.treeTable.events.emitLoading(true);
    this.treeTable.tree.initLoadNodes()
      .then(() => {
        this.treeTable.flatten();
      })
      .finally(() => { this.treeTable.events.emitLoading(false); });
  }

  private onExpand(node: TreeNode): void {
    node.expanded = !node.expanded;
    if (node.expanded) {
      node.$$loading = true;
      this.treeTable.tree.loadNode(node)
        .then(() => {
          node.$$loading = false; // before flatten
          this.treeTable.flatten();
        })
        .finally(() => { node.$$loading = false; });
    } else {
      node.$$loading = false; // before flatten
      this.treeTable.flatten();
    }
  }

  private onCheckbox(event: CustomEvent) {
    this.treeTable.selectionToggle(event.detail);
  }

}

customElements.define('web-tree-table', TreeTableComponent);
