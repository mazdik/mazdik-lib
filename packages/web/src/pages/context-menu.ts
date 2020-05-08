import { Page } from '../page';
import html from './context-menu.html';
import '@mazdik-lib/context-menu';
import { ContextMenuComponent, MenuEventArgs } from '@mazdik-lib/context-menu';
import { MenuItem } from '@mazdik-lib/common';

export default class ContextMenuDemo implements Page {

  get template(): string { return html; }

  load() {
    const items: MenuItem[] = [
      { label: 'View Task', command: (event) => console.log('View ' + event) },
      { label: 'Edit Task', command: (event) => console.log('Edit ' + event) },
      { label: 'Delete Task', command: (event) => console.log('Delete ' + event), disabled: true }
    ];

    const contextMenu = document.querySelector('#contextMenu') as ContextMenuComponent;
    contextMenu.menu = items;

    function show(event) {
      const left = event.target.offsetLeft + event.target.offsetWidth;
      const top = event.target.offsetTop;
      contextMenu.show({ originalEvent: event, data: 'test', left, top } as MenuEventArgs);
    }

    const button = document.querySelector('#button') as HTMLButtonElement;
    button.addEventListener('click', (event) => {
      show(event);
    });
  }

}
