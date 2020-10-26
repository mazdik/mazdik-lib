export class DragToScroll {

  private handler: (event) => void;

  constructor(private element: HTMLElement, dragX: boolean = true, dragY: boolean = true) {
    this.handler = dragToScroll(this.element, dragX, dragY);
  }

  destroy(): void {
    this.element.addEventListener('mousedown', this.handler);
  }

}

function dragToScroll(element: HTMLElement, dragX: boolean, dragY: boolean) {
  element.style.cursor = 'grab';

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseDownHandler = (event) => {
    element.style.cursor = 'grabbing';
    element.style.userSelect = 'none';

    pos = {
      left: element.scrollLeft,
      top: element.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = (event) => {
    const dx = event.clientX - pos.x;
    const dy = event.clientY - pos.y;

    if (dragX) {
      element.scrollLeft = pos.left - dx;
    }
    if (dragY) {
      element.scrollTop = pos.top - dy;
    }
  };

  const mouseUpHandler = () => {
    element.style.cursor = 'grab';
    element.style.removeProperty('user-select');

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  element.addEventListener('mousedown', mouseDownHandler);
  return mouseDownHandler;
}
