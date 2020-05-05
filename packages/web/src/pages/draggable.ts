import { Page } from '../page';
import html from './draggable.html';
import { Draggable } from '@mazdik-lib/draggable';

export default class DraggableDemo implements Page {

  get template(): string { return html; }

  load() {
    function add(selector: string) {
      const box1 = document.querySelector(selector) as HTMLElement;
      const draggable1 = new Draggable(box1);
      box1.addEventListener('mousedown', (event) => {
        draggable1.start(event);
      });
    }

    add('#box1');
    add('#box2');
  }

  onDestroy() {
  }

}
