import { Page } from '../page';
import html from './resizable.html';
import { Resizable } from '@mazdik-lib/resizable';

export default class ResizableDemo implements Page {

  get template(): string { return html; }

  load() {
    const box = document.querySelector('#box1') as HTMLElement;
    const resizable = new Resizable(box, true, true, true);
    resizable.addEventListeners();
  }

  onDestroy() {
  }

}
