import { Listener } from '@mazdik-lib/common';

export class DropdownElement {

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
