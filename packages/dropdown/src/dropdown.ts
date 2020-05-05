import { Listener } from '@mazdik-lib/common';
import { DropdownElement } from './dropdown-element';

export class Dropdown {

  private dropdowns: DropdownElement[] = [];
  private listeners: Listener[] = [];

  constructor(elements: NodeListOf<Element>) {
    elements.forEach((element: HTMLElement) => {
      this.dropdowns.push(new DropdownElement(element));
    });
    this.addEventListeners(elements);
  }

  destroy() {
    this.removeEventListeners();
    this.dropdowns.forEach(x => {
      x.removeEventListeners();
    });
  }

  private addEventListeners(elements: NodeListOf<Element>) {
    this.listeners = [
      {
        eventName: 'click',
        target: window,
        handler: this.onWindowClick.bind(this)
      }
    ];
    elements.forEach((element: HTMLElement) => {
      this.listeners.push({
        eventName: 'clickElement',
        target: element,
        handler: this.onClickElement.bind(this)
      });
    });

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onWindowClick(event: MouseEvent) {
    this.dropdowns.forEach(x => {
      x.onWindowClick(event);
    });
  }

  private onClickElement(event: CustomEvent<HTMLElement>) {
    this.dropdowns.forEach(x => {
      x.clickedElement = event.detail;
    });
  }

}
