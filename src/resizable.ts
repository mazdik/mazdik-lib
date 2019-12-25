import { isLeftButton, getEvent } from './dom-utils.js';

export interface ResizableEvent {
  width: number;
  height: number;
  event?: MouseEvent | Touch;
  direction?: 'horizontal' | 'vertical';
}

export class Resizable {

  south: boolean = true;
  east: boolean = true;
  southEast: boolean = true;
  ghost: boolean;

  private newWidth: number;
  private newHeight: number;
  private resizingS: boolean; // south
  private resizingE: boolean; // east
  private resizingSE: boolean; // south-east

  private minWidth: number;
  private maxWidth: number;
  private minHeight: number;
  private maxHeight: number;

  private startListeners = new Map<string, {
    handler: (event: Event) => void;
    options?: AddEventListenerOptions | boolean;
  }>();
  private globalListeners = new Map<string, {
    handler: (event: Event) => void;
    options?: AddEventListenerOptions | boolean;
  }>();

  constructor(private element: HTMLElement) {
    this.viewInit();
    this.addEventListeners();
  }

  viewInit(): void {
    if (this.south) {
      this.createHandle('resize-handle-s');
    }
    if (this.east) {
      this.createHandle('resize-handle-e');
    }
    if (this.southEast) {
      this.createHandle('resize-handle-se');
    }
    const computedStyle = window.getComputedStyle(this.element);
    this.minWidth = parseFloat(computedStyle.minWidth);
    this.maxWidth = parseFloat(computedStyle.maxWidth);
    this.minHeight = parseFloat(computedStyle.minHeight);
    this.maxHeight = parseFloat(computedStyle.maxHeight);
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
    const classList = ((event.target) as HTMLElement).classList;
    const isSouth = classList.contains('resize-handle-s');
    const isEast = classList.contains('resize-handle-e');
    const isSouthEast = classList.contains('resize-handle-se');

    const evt = getEvent(event);
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const screenX = evt.screenX;
    const screenY = evt.screenY;

    const isTouchEvent = event.type.startsWith('touch');
    const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
    const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

    if (isSouth || isEast || isSouthEast) {
      this.initResize(event, isSouth, isEast, isSouthEast);

      this.globalListeners
        .set(moveEvent, {
          handler: this.onMove.bind(this, width, height, screenX, screenY),
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

  onMove(width: number, height: number, screenX: number, screenY: number, event: MouseEvent | TouchEvent): void {
    const evt = getEvent(event);
    const movementX = evt.screenX - screenX;
    const movementY = evt.screenY - screenY;
    this.newWidth = width + movementX;
    this.newHeight = height + movementY;
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
    node.className = edgeClass;
    this.element.appendChild(node);
  }

  initResize(event: MouseEvent | TouchEvent, isSouth: boolean, isEast: boolean, isSouthEast: boolean) {
    if (isSouth) {
      this.resizingS = true;
    }
    if (isEast) {
      this.resizingE = true;
    }
    if (isSouthEast) {
      this.resizingSE = true;
    }
    this.element.classList.add('resizing');
    this.newWidth = this.element.clientWidth;
    this.newHeight = this.element.clientHeight;

    event.stopPropagation();
    this.element.dispatchEvent(new CustomEvent('resizeBegin'));
  }

  endResize(event: MouseEvent | TouchEvent) {
    this.resizingS = false;
    this.resizingE = false;
    this.resizingSE = false;
    this.element.classList.remove('resizing');
    const resizableEvent: ResizableEvent = { event: getEvent(event), width: this.newWidth, height: this.newHeight };
    this.element.dispatchEvent(new CustomEvent('resizeEnd', { detail: resizableEvent }));
  }

  resizeWidth(event: MouseEvent | Touch) {
    const overMinWidth = !this.minWidth || this.newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || this.newWidth <= this.maxWidth;

    if (this.resizingSE || this.resizingE) {
      if (overMinWidth && underMaxWidth) {
        if (!this.ghost) {
          this.element.style.width = `${this.newWidth}px`;
        }
        const resizableEvent: ResizableEvent = { event, width: this.newWidth, height: this.newHeight, direction: 'horizontal' };
        this.element.dispatchEvent(new CustomEvent('resizing', { detail: resizableEvent }));
      }
    }
  }

  resizeHeight(event: MouseEvent | Touch) {
    const overMinHeight = !this.minHeight || this.newHeight >= this.minHeight;
    const underMaxHeight = !this.maxHeight || this.newHeight <= this.maxHeight;

    if (this.resizingSE || this.resizingS) {
      if (overMinHeight && underMaxHeight) {
        if (!this.ghost) {
          this.element.style.height = `${this.newHeight}px`;
        }
        const resizableEvent: ResizableEvent = { event, width: this.newWidth, height: this.newHeight, direction: 'vertical' };
        this.element.dispatchEvent(new CustomEvent('resizing', { detail: resizableEvent }));
      }
    }
  }

}
