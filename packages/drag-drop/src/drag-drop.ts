import { arrayMove, arrayTransfer, Listener } from '@mazdik-lib/common';
import { Droppable } from './droppable';
import { DragElementEvent, DropElementEvent } from './types';

export class DragDrop {

  private source: HTMLElement;
  private droppables: Droppable[] = [];
  private listeners: Listener[] = [];

  constructor(droppableElements: HTMLElement[], draggableElements: HTMLElement[]) {
    droppableElements.forEach(element => {
      this.droppables.push(new Droppable(element));
      this.listeners.push({
        eventName: 'dropElement',
        target: element,
        handler: (event: CustomEvent<DropElementEvent>) => {
          this.onDrop(event.detail, element);
        }
      });
    });
    draggableElements.forEach((element, i) => {
      element.dataset.index = i.toString();
      element.draggable = true;
      this.listeners.push({
        eventName: 'dragstart',
        target: element,
        handler: this.onDragStart.bind(this)
      });
    });

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  destroy() {
    this.removeEventListeners();
    this.droppables.forEach(x => {
      x.removeEventListeners();
    });
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onDragStart(event: DragEvent) {
    const index = (event.target as HTMLElement).dataset.index;
    event.dataTransfer.setData('text', index);
    event.dataTransfer.effectAllowed = 'move';
    const dragElementEvent: DragElementEvent = { event, index: parseInt(index, 10) };
    this.droppables.forEach(x => x.dragElementEvent = dragElementEvent);

    this.source = (event.target as HTMLElement).parentElement;
  }

  private onDrop(event: DropElementEvent, target: HTMLElement) {
    const sourceChildrens = Array.from(this.source.children);
    const targetChildrens = Array.from(target.children);

    if (event.type === 'reorder') {
      arrayMove(targetChildrens, event.previousIndex, event.currentIndex);
      targetChildrens.forEach((x: HTMLElement, i) => x.dataset.index = i.toString());
      target.append(...targetChildrens);
    } else {
      arrayTransfer(sourceChildrens, targetChildrens, event.previousIndex, event.currentIndex);
      sourceChildrens.forEach((x: HTMLElement, i) => x.dataset.index = i.toString());
      targetChildrens.forEach((x: HTMLElement, i) => x.dataset.index = i.toString());
      this.source.append(...sourceChildrens);
      target.append(...targetChildrens);
    }
  }

}
