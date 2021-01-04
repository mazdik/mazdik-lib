export interface DragElementEvent {
  event: DragEvent;
  index: number;
}

export interface DropElementEvent {
  previousIndex: number;
  currentIndex: number;
  type: 'move' | 'reorder';
}

export interface DropEventArgs {
  target: HTMLElement;
  movedItem: HTMLElement;
  type: 'move' | 'reorder';
}
