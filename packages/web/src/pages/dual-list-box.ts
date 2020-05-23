import { Page } from '../page';
import '@mazdik-lib/dual-list-box';
import { DualListBoxComponent } from '@mazdik-lib/dual-list-box';
import { SelectItem } from '@mazdik-lib/common';

export default class DualListBoxDemo implements Page {

  get template(): string {
    return `<web-dual-list-box class="dual-list-box-demo"></web-dual-list-box>`;
  }

  load() {
    const source: SelectItem[] = [
      {id: '1', name: 'name 1'},
      {id: '2', name: 'name 2'},
      {id: '3', name: 'name 3'},
      {id: '4', name: 'name 4'},
      {id: '5', name: 'name 5'},
      {id: '6', name: 'name 6'},
      {id: '7', name: 'name 7'},
      {id: '8', name: 'name 8'},
    ];
    const target: SelectItem[] = [
      {id: '9', name: 'name 9'},
      {id: '10', name: 'name 10'},
      {id: '11', name: 'name 11'},
      {id: '12', name: 'name 12'},
    ];

    const component = document.querySelector('web-dual-list-box') as DualListBoxComponent;
    component.sourceTitle = 'Source title';
    component.targetTitle = 'Target title';
    component.source = source;
    component.target = target;

    component.addEventListener('targetChange', (event: CustomEvent) => {
      console.log(event.detail);
    });
  }

}
