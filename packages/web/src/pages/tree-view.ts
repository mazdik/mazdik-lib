import { Page } from '../page';
import '@mazdik-lib/tree-view';
import { TreeViewComponent } from '@mazdik-lib/tree-view';
import { TreeDemoService } from '../shared/tree-demo-service';

export default class TreeViewDemo implements Page {

  get template(): string {
    return `<web-tree-view class="tree-view-demo"></web-tree-view>`;
  }

  load() {
    const treeService = new TreeDemoService();
    const getIconFunc = (node) => (!node.isLeaf()) ? 'dt-icon-folder' : 'dt-icon-file';

    const component = document.querySelector('web-tree-view') as TreeViewComponent;
    component.getIconFunc = getIconFunc;
    component.serverSideFiltering = true;
    component.service = treeService;
  }

}
