import { Page } from '../page';
import html from './tabs.html';
import '@mazdik-lib/tabs';
import { TabsComponent } from '@mazdik-lib/tabs';
import { SelectItem } from '@mazdik-lib/common';

export default class TabsDemo implements Page {

  get template(): string { return html; }

  load() {
    const tabs: SelectItem[] = [
      {id: '1', name: 'Select 1'},
      {id: '2', name: 'Select 2'},
      {id: '3', name: 'Select 3'},
      {id: '4', name: 'Select 4'},
      {id: '5', name: 'Select 5'},
      {id: '6', name: 'Select 6'},
    ];
    const tabsComponent = document.querySelector('web-tabs') as TabsComponent;
    tabsComponent.addEventListener('selectTab', (event: CustomEvent) => {
      console.log(event.detail);
    });
    tabsComponent.tabs = tabs;
  }

}
