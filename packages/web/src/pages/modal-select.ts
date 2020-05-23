import { Page } from '../page';
import '@mazdik-lib/modal-select';
import { ModalSelectComponent } from '@mazdik-lib/modal-select';
import { SelectItem } from '@mazdik-lib/common';

export default class TabsDemo implements Page {

  get template(): string {
    return `<web-modal-select class="modal-select-demo"></web-modal-select>`;
  }

  load() {
    const options: SelectItem[] = [];
    for (let index = 1; index <= 30; index++) {
      options.push({id: index.toString(), name: `Select ${index}`});
    }

    const component = document.querySelector('web-modal-select') as ModalSelectComponent;
    component.model = '5';
    component.options = options;
    component.addEventListener('valueChange', (event: CustomEvent) => {
      console.log(event.detail);
    });
  }

}
