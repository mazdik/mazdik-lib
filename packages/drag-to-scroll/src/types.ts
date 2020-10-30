export class DragToScrollOptions {
  dragX?: boolean = true;
  dragY?: boolean = true;

  constructor(init?: Partial<DragToScrollOptions>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
