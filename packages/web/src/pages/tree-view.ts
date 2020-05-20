import { Page } from '../page';
import '@mazdik-lib/tree-view';
import { TreeViewComponent } from '@mazdik-lib/tree-view';
import { TreeDemoService } from '../shared/tree-demo-service';

export default class TreeViewDemo implements Page {

  get template(): string {
    return `<web-tree-view class="tree-view-demo"></web-tree-view>`;
  }

  load() {
    const navMenuNodes: any[] = [
      {
        name: 'First menu',
        expanded: true,
        children: [
          { id: '/page1', name: 'Menu 1 link 1' },
          { id: '/page2', name: 'Menu 1 link 2' },
          {
            name: 'Submenu ',
            expanded: true,
            children: [
              { id: '/page3', name: 'Submenu link 1' },
              { id: '/page4', name: 'Submenu link 2' },
              { id: '/page5', name: 'Submenu link 3' },
            ]
          },
        ]
      },
      {
        name: 'Second menu',
        expanded: true,
        children: [
          { id: '/page6', name: 'Menu 2 link 1' },
          { id: '/page7', name: 'Menu 2 link 2' },
          { id: '/page8', name: 'Menu 2 link 3' },
        ]
      },
      {
        name: 'With icons',
        expanded: true,
        icon: 'dt-icon-reload',
        children: [
          { id: '/page9', name: 'Menu 2 link 1', icon: 'dt-icon-shrink' },
          { id: '/page10', name: 'Menu 2 link 2', icon: 'dt-icon-reload' },
          { id: '/page11', name: 'Menu 2 link 3', icon: 'dt-icon-shrink' },
        ]
      }
    ];

    const component = document.querySelector('web-tree-view') as TreeViewComponent;
    component.nodes = navMenuNodes;

    const treeService = new TreeDemoService();
    treeService.getNodes(null).then(res => {
      console.log(res);
    });
  }

}
