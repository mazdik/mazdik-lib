import { Page } from '../page';
import { Draggable } from '@mazdik-lib/draggable';

export default class DraggableDemo implements Page {

  get template(): string {
    return `<div class="draggable-directive-demo">
    <div class="dd-box box1" id="box1"></div>
    <div class="dd-box box2" id="box2"></div>
  </div>`;
  }

  private draggableElements: Draggable[] = [];

  load() {
    this.add('#box1');
    this.add('#box2');
  }

  onDestroy() {
    this.draggableElements.forEach(x => x.destroy());
  }

  private add(selector: string) {
    const box1 = document.querySelector(selector) as HTMLElement;
    const draggable = new Draggable(box1);
    box1.addEventListener('mousedown', (event) => {
      draggable.start(event);
    });
    this.draggableElements.push(draggable);
  }

}
