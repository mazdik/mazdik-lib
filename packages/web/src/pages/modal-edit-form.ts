import { Page } from '../page';
import '@mazdik-lib/modal-edit-form';
import { ModalEditFormComponent } from '@mazdik-lib/modal-edit-form';

export default class ModalEditFormDemo implements Page {

  get template(): string {
    return `<web-modal-edit-form></web-modal-edit-form>`;
  }

  load() {
    const component = document.querySelector('web-modal-edit-form') as ModalEditFormComponent;
  }

}
