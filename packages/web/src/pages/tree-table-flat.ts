import { Page } from '../page';
import '@mazdik-lib/tree-table';
import { Settings } from '@mazdik-lib/data-table';
import { TreeTableComponent, TreeTable } from '@mazdik-lib/tree-table';
import { getTreeColumns } from '../shared/columns';
import { TreeBuilder } from '@mazdik-lib/tree-lib';

export default class TreeTableFlatDemo implements Page {

  get template(): string {
    return `<p>Build tree array from flat array (id, parentId)</p>
    <web-tree-table></web-tree-table>`;
  }

  load() {
    const component = document.querySelector('web-tree-table') as TreeTableComponent;

    const columns = getTreeColumns();

    const settings = new Settings({
      selectionMultiple: true,
      selectionMode: 'checkbox',
      filter: false,
      sortable: false,
    });
    const treeTable = new TreeTable(columns, settings, null);
    component.treeTable = treeTable;

    treeTable.events.emitLoading(true);
    fetch('assets/flatten-tree.json')
      .then(res => res.json())
      .then(data => {
        const nodes = TreeBuilder.rowsToTree(data, 'parentId', 'id');
        treeTable.nodes = nodes;
        treeTable.events.emitLoading(false);
      });
  }

}
