import { Page } from '../page';
import html from './nav-menu.html';
import '@mazdik-lib/nav-menu';
import { NavMenuComponent } from '@mazdik-lib/nav-menu';

export default class NavMenuDemo implements Page {

  get template(): string { return html; }

  load() {
    const navMenuNodes: any[] = [
      {
        name: 'First menu',
        expanded: true,
        children: [
          { id: '/crud-table-demo', name: 'Menu 1 link 1' },
          { id: '/data-table-demo', name: 'Menu 1 link 2' },
          {
            name: 'Submenu ',
            expanded: true,
            children: [
              { id: '/nav-menu-demo', name: 'Submenu link 1' },
              { id: '/data-table-demo', name: 'Submenu link 2' },
              { id: '/tree-table-demo', name: 'Submenu link 3' },
            ]
          },
        ]
      },
      {
        name: 'Second menu',
        children: [
          { id: '/crud-table-demo', name: 'Menu 2 link 1' },
          { id: '/data-table-demo', name: 'Menu 2 link 2' },
          { id: '/tree-table-demo', name: 'Menu 2 link 3' },
        ]
      },
      {
        name: 'With icons',
        icon: 'dt-icon-reload',
        children: [
          { id: '/crud-table-demo', name: 'Menu 2 link 1', icon: 'dt-icon-shrink' },
          { id: '/data-table-demo', name: 'Menu 2 link 2', icon: 'dt-icon-reload' },
          { id: '/tree-table-demo', name: 'Menu 2 link 3', icon: 'dt-icon-shrink' },
        ]
      }
    ];

    const navMenu1 = document.querySelector('#nav-menu1') as NavMenuComponent;
    navMenu1.minimize = false;
    navMenu1.nodes = navMenuNodes;

    const navMenu2 = document.querySelector('#nav-menu2') as NavMenuComponent;
    navMenu2.minimize = true;
    navMenu2.nodes = navMenuNodes;

    navMenu1.addEventListener('linkClicked', (event: CustomEvent) => {
      console.log(event.detail);
    });
  }

}
