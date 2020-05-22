import { Page } from '../page';
import '@mazdik-lib/tree-view';
import { TreeViewComponent } from '@mazdik-lib/tree-view';
import { TreeDemoService } from '../shared/tree-demo-service';
import '@mazdik-lib/context-menu';
import { ContextMenuComponent, MenuEventArgs } from '@mazdik-lib/context-menu';
import { MenuItem } from '@mazdik-lib/common';

export default class TreeViewDemo implements Page {

  get template(): string {
    return `<web-tree-view class="tree-view-demo"></web-tree-view>
    <web-context-menu id="contextMenu"></web-context-menu>`;
  }

  load() {
    const treeService = new TreeDemoService();
    const getIconFunc = (node) => (!node.isLeaf()) ? 'dt-icon-folder' : 'dt-icon-file';

    const component = document.querySelector('web-tree-view') as TreeViewComponent;
    component.getIconFunc = getIconFunc;
    component.serverSideFiltering = true;
    component.service = treeService;

    const items: MenuItem[] = [
      { label: 'View Task', command: (event) => console.log('View ' + event) },
      { label: 'Edit Task', command: (event) => console.log('Edit ' + event) },
      { label: 'Delete Task', command: (event) => console.log('Delete ' + event), disabled: true }
    ];
    const contextMenu = document.querySelector('#contextMenu') as ContextMenuComponent;
    contextMenu.menu = items;

    component.addEventListener('selectedChanged', (event: CustomEvent) => {
      console.log(event.detail);
    });
    component.addEventListener('nodeRightClick', (event: CustomEvent) => {
      contextMenu.show({originalEvent: event.detail.originalEvent, data: event.detail.data} as MenuEventArgs);
    });
  }

}
