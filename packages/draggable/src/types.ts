export interface DraggableEvent {
  event?: MouseEvent | Touch;
  left: number;
  top: number;
}

export class DraggableOptions {
  dragX?: boolean = true;
  dragY?: boolean = true;
  inViewport?: boolean = false;
  relative?: boolean = false;
  inPercentage?: boolean = false;
  stopPropagation?: boolean = false;

  constructor(init?: Partial<DraggableOptions>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
