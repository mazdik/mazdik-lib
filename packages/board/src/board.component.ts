import { Listener } from '@mazdik-lib/common';
import { DragDrop, DropEventArgs } from '@mazdik-lib/drag-drop';
import { BoardColumn, BoardCard, BoardEventArgs } from './types';

export class BoardComponent extends HTMLElement {

  get boardColumns(): BoardColumn[] {
    return this._boardColumns;
  }
  set boardColumns(value: BoardColumn[]) {
    this._boardColumns = value;
    this.widthPercent = 100 / value.length;
    this.render();
  }
  private _boardColumns: BoardColumn[] = [];

  private widthPercent: number;
  private source: BoardColumn;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private dragDrop: DragDrop;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
    this.dragDrop.destroy();
  }

  private onInit() {
    this.renderInit();
  }

  private addEventListeners(droppableElements: HTMLElement[]) {
    droppableElements.forEach(droppableElement => {
      const listener = {
        eventName: 'droppableElementChange',
        target: droppableElement,
        handler: this.onDroppableElementChange.bind(this)
      };
      this.listeners.push(listener);
      listener.target.addEventListener(listener.eventName, listener.handler);
    });
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onDroppableElementChange(event: CustomEvent<DropEventArgs>) {
    if (event && event.detail) {
      const target = event.detail.target;
      const targetId = (target && target.dataset.id) ? target.dataset.id : '-1';
      const columnId = parseInt(targetId, 10);

      const movedItem = event.detail.movedItem;
      const movedItemId = (movedItem && movedItem.dataset.id) ? movedItem.dataset.id : '-1';
      const cardId = parseInt(movedItemId, 10);
      const cards: BoardCard[] = this.boardColumns.reduce((prev, cur) => prev.concat(cur.cards), []);
      const movedCard = cards.find(x => x.id === cardId);

      const result: BoardEventArgs = {
        columnId,
        movedCard,
        type: event.detail.type
      };
      this.dispatchEvent(new CustomEvent('boardChange', { detail: result }));
    }
  }

  private renderInit() {
    this.classList.add('board');
  }

  private render() {
    this.removeEventListeners();
    if (this.dragDrop) {
      this.dragDrop.destroy();
    }
    this.innerHTML = '';

    const [columnElements, columnBodyElements, cardElements] = this.createElements(this.boardColumns);
    this.append(...columnElements);

    this.dragDrop = new DragDrop(columnBodyElements, cardElements);
    this.addEventListeners(columnBodyElements);
  }

  private createElements(data: BoardColumn[]): [HTMLElement[], HTMLElement[], HTMLElement[]] {
    const columnElements = [];
    const columnBodyElements = [];
    let cardElements = [];

    data.forEach(item => {
      const column = document.createElement('div');
      column.classList.add('board-column');
      column.style.width = this.widthPercent + '%';

      const columnHeader = document.createElement('div');
      columnHeader.classList.add('board-column-header');
      columnHeader.textContent = item.name;
      column.append(columnHeader);

      const columnBody = document.createElement('div');
      columnBody.classList.add('board-column-body', 'scrollbar');
      columnBody.dataset.id = item.id.toString();
      column.append(columnBody);

      const card = this.createCardElements(item.cards);
      columnBody.append(...card);

      cardElements = cardElements.concat(card);
      columnElements.push(column);
      columnBodyElements.push(columnBody);
    });

    return [columnElements, columnBodyElements, cardElements];
  }

  private createCardElements(cards: BoardCard[]): HTMLElement[] {
    const elements = [];

    cards.forEach(card => {
      const element = document.createElement('div');
      element.classList.add('board-card');
      element.dataset.id = card.id.toString();

      const title = document.createElement('div');
      title.classList.add('board-card-title');
      title.textContent = card.name;
      element.append(title);

      const text = document.createElement('div');
      text.classList.add('board-card-text');
      text.textContent = card.text;
      element.append(text);

      elements.push(element);
    });

    return elements;
  }

}

customElements.define('web-board', BoardComponent);
