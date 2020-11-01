import { isLeftButton, getEvent } from '@mazdik-lib/common';
import { ResizableEvent, ResizableOptions } from './types';

export class Resizable {

  private newWidth: number;
  private newHeight: number;
  private newLeft: number;
  private resizingS: boolean; // south
  private resizingE: boolean; // east
  private resizingSE: boolean; // south-east
  private resizingW: boolean; // west

  private minWidth: number;
  private maxWidth: number;
  private minHeight: number;
  private maxHeight: number;
  private parentElementWidth: number;
  private parentElementHeight: number;
  private resultWidth: number;
  private resultHeight: number;
  private resultLeft: number;
  private options: ResizableOptions;

  private startListeners = new Map<string, {
    handler: (event: Event) => void;
    options?: AddEventListenerOptions | boolean;
  }>();
  private globalListeners = new Map<string, {
    handler: (event: Event) => void;
    options?: AddEventListenerOptions | boolean;
  }>();

  private get unit(): string {
    return this.options.inPercentage ? '%' : 'px';
  }

  constructor(private element: HTMLElement, options?: ResizableOptions) {
    this.options = new ResizableOptions(options);
    this.viewInit();
  }

  private viewInit(): void {
    if (this.options.south) {
      this.createHandle('resize-handle-s');
    }
    if (this.options.east) {
      this.createHandle('resize-handle-e');
    }
    if (this.options.southEast) {
      this.createHandle('resize-handle-se');
    }
    if (this.options.west) {
      this.createHandle('resize-handle-w');
    }
  }

  destroy(): void {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.startListeners
      .set('mousedown', {
        handler: this.onMousedown.bind(this),
        options: false
      })
      .set('touchstart', {
        handler: this.onMousedown.bind(this),
        options: false
      });

    this.startListeners.forEach((config, name) => {
      this.element.addEventListener(name, config.handler, config.options);
    });
  }

  removeEventListeners() {
    this.startListeners.forEach((config, name) => {
      this.element.removeEventListener(name, config.handler, config.options);
    });
  }

  onMousedown(event: MouseEvent | TouchEvent): void {
    if (!isLeftButton(event)) {
      return;
    }
    this.initMinMax();
    const classList = ((event.target) as HTMLElement).classList;
    const isSouth = classList.contains('resize-handle-s');
    const isEast = classList.contains('resize-handle-e');
    const isSouthEast = classList.contains('resize-handle-se');
    const isWest = classList.contains('resize-handle-w');

    const evt = getEvent(event);
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const left = this.element.offsetLeft;
    const screenX = evt.screenX;
    const screenY = evt.screenY;
    this.parentElementWidth = this.element.parentElement.clientWidth;
    this.parentElementHeight = this.element.parentElement.clientHeight;

    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

    if (isSouth || isEast || isSouthEast || isWest) {
      this.initResize(event, isSouth, isEast, isSouthEast, isWest);

      this.globalListeners
        .set(moveEvent, {
          handler: this.onMove.bind(this, width, height, screenX, screenY, left),
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
  }

  onMove(width: number, height: number, screenX: number, screenY: number, left: number, event: MouseEvent | TouchEvent): void {
    const evt = getEvent(event);
    const movementX = evt.screenX - screenX;
    const movementY = evt.screenY - screenY;
    if (this.resizingW) {
      this.newWidth = width - movementX;
      this.newLeft = left + movementX;
    } else {
      this.newWidth = width + movementX;
    }
    this.newHeight = height + movementY;
    if (this.options.inPercentage) {
      this.newWidth = (this.newWidth / this.parentElementWidth) * 100;
      this.newHeight = (this.newHeight / this.parentElementHeight) * 100;
      this.newLeft = (this.newLeft / this.parentElementWidth) * 100;
    }
    this.resizeWidth(evt);
    this.resizeHeight(evt);
  }

  onMouseup(event: MouseEvent | TouchEvent): void {
    this.endResize(event);
    this.globalListeners.forEach((config, name) => {
      window.document.removeEventListener(name, config.handler, config.options);
    });
  }

  private createHandle(edgeClass: string) {
    const node = document.createElement('span');
    node.classList.add(edgeClass);
    this.element.append(node);
  }

  initResize(event: MouseEvent | TouchEvent, isSouth: boolean, isEast: boolean, isSouthEast: boolean, isWest: boolean) {
    if (isSouth) {
      this.resizingS = true;
    }
    if (isEast) {
      this.resizingE = true;
    }
    if (isSouthEast) {
      this.resizingSE = true;
    }
    if (isWest) {
      this.resizingW = true;
    }
    this.element.classList.add('resizing');
    this.newWidth = this.options.inPercentage ? (this.element.clientWidth / this.parentElementWidth) * 100 : this.element.clientWidth;
    this.newHeight = this.options.inPercentage ? (this.element.clientHeight / this.parentElementHeight) * 100 : this.element.clientHeight;
    this.newLeft = this.options.inPercentage ? (this.element.offsetLeft / this.parentElementWidth) * 100 : this.element.offsetLeft;

    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('resizeBegin'));
  }

  endResize(event: MouseEvent | TouchEvent) {
    this.resizingS = false;
    this.resizingE = false;
    this.resizingSE = false;
    this.resizingW = false;
    this.element.classList.remove('resizing');
    const resizableEvent: ResizableEvent = { event: getEvent(event), width: this.resultWidth, height: this.resultHeight, left: this.resultLeft };
    this.element.dispatchEvent(new CustomEvent('resizeEnd', { detail: resizableEvent }));
  }

  resizeWidth(event: MouseEvent | Touch) {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingSE || this.resizingE || this.resizingW) {
      if (overMinWidth && underMaxWidth) {
        if (!this.options.ghost) {
          this.element.style.width = this.newWidth + this.unit;
          if (this.resizingW && this.newWidth >= 0) {
            this.element.style.left = this.newLeft + this.unit;
            this.resultLeft = this.newLeft;
          } else {
            this.resultLeft = null;
          }
        }
        this.resultWidth = this.newWidth;
        const resizableEvent: ResizableEvent = { event, width: this.newWidth, height: this.newHeight, direction: 'horizontal', left: this.newLeft };
        this.element.dispatchEvent(new CustomEvent('resizing', { detail: resizableEvent }));
      }
    }
  }

  resizeHeight(event: MouseEvent | Touch) {
    const overMinHeight = !this.minHeight || this.newHeight >= this.minHeight;
    const underMaxHeight = !this.maxHeight || this.newHeight <= this.maxHeight;

    if (this.resizingSE || this.resizingS) {
      if (overMinHeight && underMaxHeight) {
        if (!this.options.ghost) {
          this.element.style.height = this.newHeight + this.unit;
        }
        this.resultHeight = this.newHeight;
        const resizableEvent: ResizableEvent = { event, width: this.newWidth, height: this.newHeight, direction: 'vertical' };
        this.element.dispatchEvent(new CustomEvent('resizing', { detail: resizableEvent }));
      }
    }
  }

  private initMinMax() {
    const computedStyle = window.getComputedStyle(this.element);
    this.minWidth = parseFloat(computedStyle.minWidth);
    this.maxWidth = parseFloat(computedStyle.maxWidth);
    this.minHeight = parseFloat(computedStyle.minHeight);
    this.maxHeight = parseFloat(computedStyle.maxHeight);
  }

}
