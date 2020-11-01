import { isLeftButton, getEvent } from '@mazdik-lib/common';
import { DraggableEvent, DraggableOptions } from './types';

export class Draggable {

  set inViewport(val: boolean) {
    this.options.inViewport = val;
  }

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
  private resultLeftPos: number;
  private resultTopPos: number;
  private options: DraggableOptions

  constructor(private element: HTMLElement, options?: DraggableOptions) {
    this.options = new DraggableOptions(options);
  }

  start(dragEventTarget: MouseEvent | TouchEvent): void {
    this.onMousedown(dragEventTarget);
  }

  destroy(): void {
    this.removeEventListeners();
  }

  onMousedown(event: MouseEvent | TouchEvent): void {
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    if (!isLeftButton(event)) {
      return;
    }
    if (this.options.dragX || this.options.dragY) {
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
    const data: DraggableEvent = { event: getEvent(event), left: this.resultLeftPos, top: this.resultTopPos };
    this.element.dispatchEvent(new CustomEvent('dragEnd', { detail: data }));
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
    if (this.options.relative) {
      this.vw = this.element.parentElement.clientWidth;
      this.vh = this.element.parentElement.clientHeight;
    }
  }

  onDrag(pageX: number, pageY: number) {
    if (this.isDragging) {
      const deltaX = pageX - this.lastPageX;
      const deltaY = pageY - this.lastPageY;
      let left = this.element.offsetLeft;
      let top = this.element.offsetTop;
      if (!this.options.relative) {
        const coords = this.element.getBoundingClientRect();
        left = coords.left;
        top = coords.top;
      }
      let leftPos = left + deltaX;
      let topPos = top + deltaY;

      const overWidth = !this.options.inViewport || leftPos >= 0 && (leftPos + this.elementWidth) <= this.vw;
      const overHeight = !this.options.inViewport || topPos >= 0 && (topPos + this.elementHeight) <= this.vh;
      if (overWidth) {
        this.lastPageX = pageX;
      }
      if (overHeight) {
        this.lastPageY = pageY;
      }

      if (this.options.inViewport) {
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

      if (this.options.dragX) {
        const leftPosPercent = (leftPos / this.vw) * 100;
        this.element.style.left = this.options.inPercentage ? leftPosPercent + '%' : leftPos + 'px';
        this.resultLeftPos = this.options.inPercentage ? leftPosPercent : leftPos;
      }
      if (this.options.dragY) {
        const topPosPercent = (topPos / this.vh) * 100;
        this.element.style.top = this.options.inPercentage ? topPosPercent + '%' : topPos + 'px';
        this.resultTopPos = this.options.inPercentage ? topPosPercent : topPos;
      }
      this.lastPageX = pageX;
      this.lastPageY = pageY;
    }
  }

  endDrag() {
    this.isDragging = false;
    this.element.classList.remove('dragging');
  }

}
