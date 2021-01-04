import { Page } from '../page';
import { DragDrop, DropEventArgs } from '@mazdik-lib/drag-drop';
import { Listener } from '@mazdik-lib/common';

export default class DragDropDemo implements Page {

  get template(): string {
    return `<div class="drag-drop-demo">
      <div class="dd-column">
        <div class="dd-box box1"></div>
        <div class="dd-box box2"></div>
      </div>
      <div class="dd-column">
        <div class="dd-box box3"></div>
        <div class="dd-box box4"></div>
      </div>
    </div>`;
  }

  private dragDrop: DragDrop;
  private listeners: Listener[] = [];

  load() {
    const droppableElements: HTMLElement[] = Array.from(document.querySelectorAll('.dd-column'));
    const draggableElements: HTMLElement[] = Array.from(document.querySelectorAll('.dd-box'));

    this.dragDrop = new DragDrop(droppableElements, draggableElements);
    this.addEventListeners(droppableElements);
  }

  onDestroy() {
    this.removeEventListeners();
    this.dragDrop.destroy();
  }

  private addEventListeners(droppableElements: HTMLElement[]) {
    droppableElements.forEach(droppableElement => {
      const listener = {
        eventName: 'droppableElementChange',
        target: droppableElement,
        handler: this.onDroppableElementChange.bind(this)
      };
      this.listeners.push(listener);
      listener.target.addEventListener(listener.eventName, listener.handler);
    });
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onDroppableElementChange(event: CustomEvent<DropEventArgs>) {
    console.log(event.detail);
  }

}
