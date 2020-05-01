import { Listener } from '@mazdik-lib/common';
import { DragElementEvent, DropElementEvent } from './types';

export class Droppable  {

  dragElementEvent: DragElementEvent;

  private listeners: Listener[] = [];

  constructor(private element: HTMLElement) {
    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'dragenter',
        target: this.element,
        handler: this.onDragEnter.bind(this)
      },
      {
        eventName: 'dragover',
        target: this.element,
        handler: this.onDragOver.bind(this)
      },
      {
        eventName: 'dragleave',
        target: this.element,
        handler: this.onDragLeave.bind(this)
      },
      {
        eventName: 'drop',
        target: this.element,
        handler: this.onDrop.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onDragEnter(event: DragEvent) {
    event.preventDefault();
  }

  private onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    const dragParentElement = (this.dragElementEvent.event.target as HTMLElement).parentElement;
    const position = Math.max(0, this.getNumberPosition(event.target));

    let resultEvent: DropElementEvent;
    if (dragParentElement === this.element) {
      resultEvent = { previousIndex: this.dragElementEvent.index, currentIndex: position, type: 'reorder' };
    } else {
      resultEvent = { previousIndex: this.dragElementEvent.index, currentIndex: position, type: 'move' };
    }
    this.element.dispatchEvent(new CustomEvent('dropElement', { detail: resultEvent }));
  }

  private getNumberPosition(elem) {
    const dragTarget: HTMLElement = (this.dragElementEvent.event.target as HTMLElement).parentElement;
    const dropTarget: HTMLElement = this.element;
    if (elem === dragTarget) {
      return dragTarget.children ? dragTarget.children.length : 0;
    }
    if (elem === dropTarget) {
      return dropTarget.children ? dropTarget.children.length : 0;
    }
    let spanCount = 0;
    while (elem = elem.previousSibling) {
      spanCount++;
    }
    return spanCount - 1;
  }

}
