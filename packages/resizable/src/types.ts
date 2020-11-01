export interface ResizableEvent {
  width: number;
  height: number;
  event?: MouseEvent | Touch;
  direction?: 'horizontal' | 'vertical';
  left?: number;
}

export class ResizableOptions {
  south?: boolean = true;
  east?: boolean = true;
  southEast?: boolean = true;
  west?: boolean = false;
  ghost?: boolean = false;
  inPercentage?: boolean = false;

  constructor(init?: Partial<ResizableOptions>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
