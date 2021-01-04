import { arrayMove, arrayTransfer, Listener } from '@mazdik-lib/common';
import { Droppable } from './droppable';
import { DragElementEvent, DropElementEvent, DropEventArgs } from './types';

export class DragDrop {

  private source: HTMLElement;
  private droppables: Droppable[] = [];
  private listeners: Listener[] = [];
  private draggableElements: HTMLElement[] = [];

  constructor(droppableElements: HTMLElement[], draggableElements: HTMLElement[]) {
    this.registerDroppableElements(droppableElements);
    this.registerDraggableElements(draggableElements);
  }

  destroy() {
    this.removeEventListeners();
    this.droppables.forEach(x => {
      x.removeEventListeners();
    });
  }

  registerDroppableElements(droppableElements: HTMLElement[]) {
    const listeners: Listener[] = [];

    droppableElements.forEach(element => {
      this.droppables.push(new Droppable(element));
      listeners.push({
        eventName: 'dropElement',
        target: element,
        handler: (event: CustomEvent<DropElementEvent>) => {
          this.onDrop(event.detail, element);
        }
      });
    });
    listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    });
    this.listeners = [...this.listeners, ...listeners];
  }

  registerDraggableElements(draggableElements: HTMLElement[]) {
    const listeners: Listener[] = [];

    draggableElements.forEach(element => {
      element.draggable = true;
      listeners.push({
        eventName: 'dragstart',
        target: element,
        handler: this.onDragStart.bind(this)
      });
      this.draggableElements.push(element);
    });
    this.draggableElements.forEach((x, i) => x.dataset.index = i.toString());

    listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    });
    this.listeners = [...this.listeners, ...listeners];
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onDragStart(event: DragEvent) {
    const element = event.target as HTMLElement;
    const index = element.dataset.index;
    event.dataTransfer.setData('text', index);
    event.dataTransfer.effectAllowed = 'move';
    const dragElementEvent: DragElementEvent = { event, index: parseInt(index, 10) };
    this.droppables.forEach(x => x.dragElementEvent = dragElementEvent);

    this.source = (event.target as HTMLElement).parentElement;
  }

  private onDrop(event: DropElementEvent, target: HTMLElement) {
    const sourceChildrens = Array.from(this.source.children);
    const targetChildrens = Array.from(target.children);

    let movedItem;
    if (event.type === 'reorder') {
      movedItem = arrayMove(targetChildrens, event.previousIndex, event.currentIndex);
      targetChildrens.forEach((x: HTMLElement, i) => x.dataset.index = i.toString());
      target.append(...targetChildrens);
    } else {
      movedItem = arrayTransfer(sourceChildrens, targetChildrens, event.previousIndex, event.currentIndex);
      sourceChildrens.forEach((x: HTMLElement, i) => x.dataset.index = i.toString());
      targetChildrens.forEach((x: HTMLElement, i) => x.dataset.index = i.toString());
      this.source.append(...sourceChildrens);
      target.append(...targetChildrens);
    }
    const result: DropEventArgs = { target, movedItem, type: event.type };
    target.dispatchEvent(new CustomEvent('droppableElementChange', { detail: result }));
  }

}
