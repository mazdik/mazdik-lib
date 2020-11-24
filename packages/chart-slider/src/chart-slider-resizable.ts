import { Listener } from '@mazdik-lib/common';
import { ChartSliderResizableEvent } from './types';

export class ChartSliderResizable {

  private newWidth: number;
  private newLeft: number;
  private resizingE: boolean; // east
  private resizingW: boolean; // west

  private minWidth: number;
  private maxWidth: number;
  private parentElementWidth: number;
  private resultWidth: number;
  private resultLeft: number;

  private handleE: HTMLElement;
  private handleW: HTMLElement;

  private startListeners: Listener[] = [];
  private globalListeners: Listener[] = [];

  private get unit(): string {
    return this.inPercentage ? '%' : 'px';
  }

  constructor(private element: HTMLElement, private inPercentage) {
    this.viewInit();
    this.addEventListeners();
  }

  private viewInit(): void {
    this.handleE = this.createHandle('resize-e');
    this.element.append(this.handleE);
    this.handleW = this.createHandle('resize-w');
    this.element.append(this.handleW);
  }

  destroy(): void {
    this.removeEventListeners();
  }

  private addEventListeners(): void {
    this.startListeners = [
      {
        eventName: 'mousedown',
        target: this.element,
        handler: this.onMousedown.bind(this)
      },
    ];

    this.startListeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners(): void {
    this.startListeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onMousedown(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    this.initMinMax();
    const target = (event.target) as HTMLElement;
    const isEast = target === this.handleE || target.parentElement === this.handleE;
    const isWest = target === this.handleW || target.parentElement === this.handleW;

    const width = this.element.clientWidth;
    const left = this.element.offsetLeft;
    const screenX = event.screenX;
    this.parentElementWidth = this.element.parentElement.clientWidth;

    if (isEast || isWest) {
      this.initResize(event, isEast, isWest);

      this.globalListeners = [
        {
          eventName: 'mousemove',
          target: window,
          handler: this.onMove.bind(this, width, screenX, left)
        },
        {
          eventName: 'mouseup',
          target: window,
          handler: this.onMouseup.bind(this)
        },
      ];
      this.globalListeners.forEach(x => {
        x.target.addEventListener(x.eventName, x.handler);
      })
    }
  }

  private onMove(width: number, screenX: number, left: number, event: MouseEvent): void {
    const movementX = event.screenX - screenX;
    if (this.resizingW) {
      this.newWidth = width - movementX;
      this.newLeft = left + movementX;
    } else {
      this.newWidth = width + movementX;
    }
    if (this.inPercentage) {
      this.newWidth = (this.newWidth / this.parentElementWidth) * 100;
      this.newLeft = (this.newLeft / this.parentElementWidth) * 100;
    }
    this.resizeWidth();
  }

  private onMouseup(): void {
    this.endResize();
    this.globalListeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private createHandle(edgeClass: string): HTMLElement {
    const element = document.createElement('div');
    element.classList.add(edgeClass);

    const handle = document.createElement('div');
    handle.classList.add('resize-handle');
    element.append(handle);

    return element;
  }

  private initResize(event: MouseEvent, isEast: boolean, isWest: boolean): void {
    if (isEast) {
      this.resizingE = true;
    }
    if (isWest) {
      this.resizingW = true;
    }
    this.element.classList.add('resizing');
    this.newWidth = this.inPercentage ? (this.element.clientWidth / this.parentElementWidth) * 100 : this.element.clientWidth;
    this.newLeft = this.inPercentage ? (this.element.offsetLeft / this.parentElementWidth) * 100 : this.element.offsetLeft;

    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('resizeBegin'));
  }

  private endResize(): void {
    this.resizingE = false;
    this.resizingW = false;
    this.element.classList.remove('resizing');
    const resizableEvent: ChartSliderResizableEvent = { width: this.resultWidth, left: this.resultLeft };
    this.element.dispatchEvent(new CustomEvent('resizeEnd', { detail: resizableEvent }));
  }

  private resizeWidth(): void {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingE || this.resizingW) {
      if (overMinWidth && underMaxWidth) {
        this.element.style.width = this.newWidth + this.unit;
        if (this.resizingW && this.newWidth >= 0) {
          this.element.style.left = this.newLeft + this.unit;
          this.resultLeft = this.newLeft;
        } else {
          this.resultLeft = null;
        }
        this.resultWidth = this.newWidth;
        const resizableEvent: ChartSliderResizableEvent = { width: this.newWidth, left: this.newLeft };
        this.element.dispatchEvent(new CustomEvent('resizing', { detail: resizableEvent }));
      }
    }
  }

  private initMinMax(): void {
    const computedStyle = window.getComputedStyle(this.element);
    this.minWidth = parseFloat(computedStyle.minWidth);
    this.maxWidth = parseFloat(computedStyle.maxWidth);
  }

}
