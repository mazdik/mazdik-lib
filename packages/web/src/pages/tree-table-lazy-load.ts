import { Page } from '../page';
import '@mazdik-lib/tree-table';
import { Settings } from '@mazdik-lib/data-table';
import { TreeTableComponent, TreeTable } from '@mazdik-lib/tree-table';
import { getTreeColumns } from '../shared/columns';
import { TreeDemoService } from '../shared/tree-demo-service';

export default class TreeTableLazyDemo implements Page {

  get template(): string {
    return `<p>Tree with lazy load child nodes</p>
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

    const treeService = new TreeDemoService();
    const treeTable = new TreeTable(columns, settings, treeService);
    treeTable.pager.perPage = 1000;
    treeTable.getIconFunc = (node) => (!node.isLeaf()) ? 'dt-icon-folder' : 'dt-icon-file';

    component.treeTable = treeTable;
  }

}
