import { Page } from '../page';
import html from './resizable.html';
import { Resizable } from '@mazdik-lib/resizable';

export default class ResizableDemo implements Page {

  get template(): string { return html; }

  private resizable: Resizable;

  load() {
    const box = document.querySelector('#box1') as HTMLElement;
    this.resizable = new Resizable(box, true, true, true);
    this.resizable.addEventListeners();
  }

  onDestroy() {
    this.resizable.destroy();
  }

}
