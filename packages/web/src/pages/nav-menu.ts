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
          { id: '/page1', name: 'Menu 1 link 1' },
          { id: '/page2', name: 'Menu 1 link 2' },
          {
            name: 'Submenu ',
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
        children: [
          { id: '/page6', name: 'Menu 2 link 1' },
          { id: '/page7', name: 'Menu 2 link 2' },
          { id: '/page8', name: 'Menu 2 link 3' },
        ]
      },
      {
        name: 'With icons',
        icon: 'dt-icon-reload',
        children: [
          { id: '/page9', name: 'Menu 2 link 1', icon: 'dt-icon-shrink' },
          { id: '/page10', name: 'Menu 2 link 2', icon: 'dt-icon-reload' },
          { id: '/page11', name: 'Menu 2 link 3', icon: 'dt-icon-shrink' },
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

    navMenu1.ensureVisible('/page4');
  }

}
