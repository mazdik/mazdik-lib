import { Page } from '../page';
import { Resizable } from '@mazdik-lib/resizable';

export default class ResizableDemo implements Page {

  get template(): string {
    return `<div class="resizable-directive-demo">
    <div class="dd-box box1" id="box1"></div>
  </div>`;
  }

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
