import { isLeftButton, getEvent } from './dom-utils.js';

export class Draggable {

  dragX: boolean = true;
  dragY: boolean = true;

  private isDragging: boolean;
  private lastPageX: number;
  private lastPageY: number;

  private globalListeners = new Map<string, {
    handler: (event: Event) => void;
    options?: AddEventListenerOptions | boolean;
  }>();

  constructor(private element: HTMLElement) {
  }

  start(dragEventTarget: MouseEvent | TouchEvent): void {
    this.onMousedown(dragEventTarget);
  }

  destroy(): void {
    this.removeEventListeners();
  }

  onMousedown(event: MouseEvent | TouchEvent): void {
    if (!isLeftButton(event)) {
      return;
    }
    if (this.dragX || this.dragY) {
      const evt = getEvent(event);
      this.initDrag(evt.pageX, evt.pageY);
      this.addEventListeners(event);
      this.element.dispatchEvent(new CustomEvent('dragStart', { detail: event }));
    }
  }

  onMousemove(event: MouseEvent | TouchEvent): void {
    const evt = getEvent(event);
    this.onDrag(evt.pageX, evt.pageY);
    this.element.dispatchEvent(new CustomEvent('dragMove', { detail: event }));
  }

  onMouseup(event: MouseEvent | TouchEvent): void {
    this.endDrag();
    this.removeEventListeners();
    this.element.dispatchEvent(new CustomEvent('dragEnd', { detail: event }));
  }

  addEventListeners(event: MouseEvent | TouchEvent) {
    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

    this.globalListeners
      .set(moveEvent, {
        handler: this.onMousemove.bind(this),
        options: false
      })
      .set(upEvent, {
        handler: this.onMouseup.bind(this),
        options: false
      });

    this.globalListeners.forEach((config, name) => {
      window.document.addEventListener(name, config.handler, config.options);
    });
  }

  removeEventListeners() {
    this.globalListeners.forEach((config, name) => {
      window.document.removeEventListener(name, config.handler, config.options);
    });
  }

  initDrag(pageX: number, pageY: number) {
    this.isDragging = true;
    this.lastPageX = pageX;
    this.lastPageY = pageY;
    this.element.classList.add('dragging');
  }

  onDrag(pageX: number, pageY: number) {
    if (this.isDragging) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      const coords = this.element.getBoundingClientRect();

      this.element.style.left = coords.left + deltaX + 'px';
      this.element.style.top = coords.top + deltaY + 'px';

      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }
  }

  endDrag() {
    this.isDragging = false;
    this.element.classList.remove('dragging');
  }

}
