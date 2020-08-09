import { Page } from '../page';
import { ModalComponent } from '@mazdik-lib/modal';
import html from './modal-basic.html';

export default class ModalBasicDemo implements Page {

  get template(): string { return html; }

  load() {
    const dialog = document.querySelector('#modal') as ModalComponent;
    dialog.inViewport = true;
    document.querySelector('#button').addEventListener('click', () => dialog.show());

    document.querySelector('#close-button').addEventListener('click', () => dialog.hide());
  }

}
