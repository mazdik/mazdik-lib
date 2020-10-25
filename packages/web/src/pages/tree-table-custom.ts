import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, Row } from '@mazdik-lib/data-table';
import { getTreeColumns } from '../shared/columns';
import { TreeFlattener, TreeNode, Tree } from '@mazdik-lib/tree-lib';
import { Listener } from '@mazdik-lib/common';
import { CellTreeNodeRenderer } from '../shared/cell-tree-node-renderer';
import { CellTreeTotalRenderer } from '../shared/cell-tree-total-renderer';

export default class TreeTableCustomDemo implements Page {

  get template(): string {
    return `<p>Editable if last level. Summed column Cube size if has children rows</p>
    <web-data-table></web-data-table>`;
  }

  private table: DataTable;
  private treeFlattener: TreeFlattener;
  private listeners: Listener[] = [];
  private dt: DataTableComponent;

  load() {
    this.dt = document.querySelector('web-data-table') as DataTableComponent;

    const settings = new Settings({
      paginator: false,
      filter: false,
      sortable: false,
      rowClass: this.getRowClass,
      isEditableCellProp: '$$editable',
      rowHeightProp: '$$height',
      selectionMultiple: true,
      selectionMode: 'checkbox',
    });

    const columns = getTreeColumns();
    const cellRenderer = new CellTreeNodeRenderer(this.getIcon, this.getExpanderIcon, this.onExpand.bind(this));
    columns[0].cellTemplate = cellRenderer;
    columns[3].cellTemplate = new CellTreeTotalRenderer(3 + 1); // + checkbox column

    this.table = new DataTable(columns, settings);
    this.table.pager.perPage = 1000;
    this.treeFlattener = new TreeFlattener(this.transformer);

    this.dt.table = this.table;

    this.table.events.emitLoading(true);
    fetch('assets/tree.json')
      .then(res => res.json())
      .then(data => {
        this.table.rows = this.prepareTreeData(data);
        this.table.events.emitLoading(false);
      });

    this.addEventListeners();
  }

  onDestroy() {
    this.removeEventListeners();
  }

  private transformer = (node: TreeNode, level: number) => {
    const data = {
      expandable: true,
      $$level: level,
      expanded: false,
      hasChildren: (node.children && node.children.length > 0)
    };
    return Object.assign(data, node.data);
  }

  private prepareTreeData(nodes: TreeNode[]) {
    const tree = new Tree();
    tree.nodes = nodes;
    const rows = this.treeFlattener.flattenNodes(tree.nodes);
    rows.forEach(x => {
      x.$$height = (x.$$level > 1) ? 0 : null;
      x.expanded = !(x.$$level > 0);
      x.$$editable = !x.hasChildren;
      x['cube_size'] = x.hasChildren ? null : x['cube_size'];
    });
    return rows;
  }

  private getRowClass(row): any {
    return {
      'row-warrior': row.$$editable,
      'row-sorcerer': (row.$$level === 0),
    };
  }

  private onExpand(row: any) {
    row.expanded = !row.expanded;
    if (!row.expanded) {
      const descendants = this.getDescendants(row, this.table.rows);
      if (descendants && descendants.length) {
        descendants.forEach(x => { x.$$height = 0; x.expanded = true; });
      }
    } else {
      const descendants = this.getDescendantsByLevel(row, this.table.rows, row.$$level + 1);
      descendants.forEach(x => { x.$$height = null; x.expanded = false; });
    }
    this.dt.updateAllStyles();
  }

  private getDescendants(row: Row, rows: Row[]) {
    const results = [];
    for (let i = row.$$index + 1; i < rows.length && row.$$level < rows[i].$$level; i++) {
      results.push(rows[i]);
    }
    return results;
  }

  private getDescendantsByLevel(row: Row, rows: Row[], level: number) {
    const results = [];
    for (let i = row.$$index + 1; i < rows.length && row.$$level < rows[i].$$level; i++) {
      if (rows[i].$$level === level) {
        results.push(rows[i]);
      }
    }
    return results;
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'checkbox',
        target: this.table.events.element,
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

  private onCheckbox(event: CustomEvent) {
    this.selectionToggle(event.detail);
  }

  private selectionToggle(row: Row): void {
    let descendants = this.getDescendants(row, this.table.rows);
    descendants = descendants.map(x => x.$$index);
    this.table.selection.isSelected(row.$$index)
      ? this.table.selection.select(...descendants)
      : this.table.selection.deselect(...descendants);
  }

  private getExpanderIcon(row: any) {
    if (row.hasChildren && !row.expanded) {
      return 'dt-icon-node dt-icon-collapsed';
    } else if (row.hasChildren) {
      return 'dt-icon-node';
    }
  }

  private getIcon(row: any) {
    return row.hasChildren ? 'dt-icon-folder' : 'dt-icon-file';
  }

}
