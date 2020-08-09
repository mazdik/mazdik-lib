import { isLeftButton, getEvent } from '@mazdik-lib/common';

export class Draggable {

  private isDragging: boolean;
  private lastPageX: number;
  private lastPageY: number;

  private globalListeners = new Map<string, {
    handler: (event: Event) => void;
    options?: AddEventListenerOptions | boolean;
  }>();
  private elementWidth: number;
  private elementHeight: number;
  private vw: number;
  private vh: number;

  constructor(private element: HTMLElement,
    private dragX: boolean = true,
    private dragY: boolean = true,
    public inViewport: boolean = true) {
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

    this.elementWidth = this.element.offsetWidth;
    this.elementHeight = this.element.offsetHeight;
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  }

  onDrag(pageX: number, pageY: number) {
    if (this.isDragging) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      const coords = this.element.getBoundingClientRect();
      let leftPos = coords.left + deltaX;
      let topPos = coords.top + deltaY;

      const overWidth = !this.inViewport || leftPos >= 0 && (leftPos + this.elementWidth) <= this.vw;
      const overHeight = !this.inViewport || topPos >= 0 && (topPos + this.elementHeight) <= this.vh;
      if (overWidth) {
        this.lastPageX = pageX;
      }
      if (overHeight) {
        this.lastPageY = pageY;
      }

      if (this.inViewport) {
        if (leftPos < 0) {
          leftPos = 0;
        }
        if ((leftPos + this.elementWidth) > this.vw) {
          leftPos = this.vw - this.elementWidth;
        }
        if (topPos < 0) {
          topPos = 0;
        }
        if ((topPos + this.elementHeight) > this.vh) {
          topPos = this.vh - this.elementHeight;
        }
      }
      this.element.style.left = leftPos + 'px';
      this.element.style.top = topPos + 'px';
    }
  }

  endDrag() {
    this.isDragging = false;
    this.element.classList.remove('dragging');
  }

}
