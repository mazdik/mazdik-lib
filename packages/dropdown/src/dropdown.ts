import { Listener } from '@mazdik-lib/common';

class DropdownElement {

  set clickedElement(el: HTMLElement) {
    if (el !== this.element && this.isOpen) {
      this.isOpen = false;
      this.updateStyles();
    }
  }

  private isOpen: boolean = false;
  private listeners: Listener[] = [];

  constructor(private element: HTMLElement) {
    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.element,
        handler: this.toggleDropdown.bind(this)
      }
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

  private toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.toggle();
    this.updateStyles();
    this.element.dispatchEvent(new CustomEvent('clickElement', { detail: this.element }));
  }

  onWindowClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement) {
      return;
    }
    const clickedInside = this.element.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
    this.updateStyles();
  }

  private updateStyles() {
    if (this.isOpen) {
      this.element.classList.add('open');
    } else {
      this.element.classList.remove('open');
    }
  }

}

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
