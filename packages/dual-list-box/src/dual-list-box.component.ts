import { SelectItem, isBlank, arrayMove, arrayTransfer, Listener } from '@mazdik-lib/common';
import { DragElementEvent, DropElementEvent } from '@mazdik-lib/drag-drop';

function getTemplate(id: string) {
  return `
<div class="dt-listbox-panel">
  <label></label>
  <div class="dt-list-menu" id="sourceList${id}" appDroppable [dragElementEvent]="dragElementEvent" (dropElement)="onDropSource($event)">
    <div class="dt-list-menu-item"
        *ngFor="let option of source; index as i"
        (click)="sourceModel = option.id"
        [ngClass]="{'active': sourceModel === option.id}"
        [draggable]="true"
        (dragstart)="onDragStart($event, i); sourceModel = option.id">
        {{option.name}}
    </div>
  </div>
</div>
<div class="dt-listbox-panel">
  <button class="dt-button" (click)="moveRightAll()" title="move all to the right">
    <i class="dt-icon-quotation-r large"></i>
  </button>
  <button class="dt-button" (click)="moveRight()" [disabled]="isBlankSourceModel" title="move selected to the right">
    <i class="dt-icon-arrow-right large"></i>
  </button>
  <button class="dt-button" (click)="moveLeft()" [disabled]="isBlankTargetModel" title="move selected to the left">
    <i class="dt-icon-arrow-left large"></i>
  </button>
  <button class="dt-button" (click)="moveLeftAll()" title="move all to the left">
    <i class="dt-icon-quotation-l large"></i>
  </button>
</div>
<div class="dt-listbox-panel">
  <label></label>
  <div class="dt-list-menu" id="targetList${id}" appDroppable [dragElementEvent]="dragElementEvent" (dropElement)="onDropTarget($event)">
    <div class="dt-list-menu-item"
        *ngFor="let option of target; index as i"
        (click)="targetModel = option.id"
        [ngClass]="{'active': targetModel === option.id}"
        [draggable]="true"
        (dragstart)="onDragStart($event, i); targetModel = option.id">
        {{option.name}}
    </div>
  </div>
</div>
<div class="dt-listbox-panel">
  <button class="dt-button" (click)="moveTop()" [disabled]="isBlankTargetModel" title="move top">
    <i class="dt-icon-tab-up large"></i>
  </button>
  <button class="dt-button" (click)="moveUp()" [disabled]="isBlankTargetModel" title="move up">
    <i class="dt-icon-arrow-up large"></i>
  </button>
  <button class="dt-button" (click)="moveDown()" [disabled]="isBlankTargetModel" title="move down">
    <i class="dt-icon-arrow-down large"></i>
  </button>
  <button class="dt-button" (click)="moveBottom()" [disabled]="isBlankTargetModel" title="move bottom">
    <i class="dt-icon-tab-down large"></i>
  </button>
</div>
  `;
}

export class DualListBoxComponent extends HTMLElement {

  set sourceTitle(val: string) {
    this.sourceList.previousSibling.textContent = val;
  }
  set targetTitle(val: string) {
    this.targetList.previousSibling.textContent = val;
  }

  get source(): SelectItem[] { return this._source; }
  set source(value: SelectItem[]) {
    this._source = value;
    this.filterSource();
    this.renderSourceListItems();
  }
  private _source: SelectItem[];

  get target(): SelectItem[] { return this._target; }
  set target(value: SelectItem[]) {
    this._target = value;
    this.filterSource();
    this.renderTargetList();
  }
  private _target: SelectItem[];

  private sourceModel: any;
  private targetModel: any;
  private dragElementEvent: DragElementEvent;

  private sourceList: HTMLElement;
  private targetList: HTMLElement;
  private listeners: Listener[] = [];

  constructor() {
    super();
    const id = (~~(Math.random() * 1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.sourceList = this.querySelector('#sourceList' + id);
    this.targetList = this.querySelector('#targetList' + id);

    this.classList.add('dt-listbox');
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.sourceList,
        handler: this.onClickSourceList.bind(this)
      },
      {
        eventName: 'click',
        target: this.targetList,
        handler: this.onClickTargetList.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  moveRight() {
    if (!isBlank(this.sourceModel) && !isBlank(this.source)) {
      const selectedItemIndex = this.source.findIndex(x => x.id === this.sourceModel);
      arrayTransfer(this.source, this.target, selectedItemIndex, this.target.length);
      this.sourceModel = null;

      this.emitEvent();
    }
  }

  moveRightAll() {
    if (!isBlank(this.source)) {
      this.target = [...this.target, ... this.source];
      this.source = [];
      this.sourceModel = null;

      this.emitEvent();
    }
  }

  moveLeft() {
    if (!isBlank(this.targetModel) && !isBlank(this.target)) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      arrayTransfer(this.target, this.source, selectedItemIndex, this.source.length);
      this.targetModel = null;

      this.emitEvent();
    }
  }

  moveLeftAll() {
    if (!isBlank(this.target)) {
      this.target.forEach(item => this.source.push(item));
      this.target = [];
      this.targetModel = null;

      this.emitEvent();
    }
  }

  moveUp() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        arrayMove(this.target, selectedItemIndex, selectedItemIndex - 1);
        if (this.targetList.children[selectedItemIndex]) {
          this.targetList.children[selectedItemIndex].scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        this.emitEvent();
      }
    }
  }

  moveTop() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        arrayMove(this.target, selectedItemIndex, 0);
        this.targetList.scrollTop = 0;

        this.emitEvent();
      }
    }
  }

  moveDown() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== (this.target.length - 1)) {
        arrayMove(this.target, selectedItemIndex, selectedItemIndex + 1);
        if (this.targetList.children[selectedItemIndex]) {
          this.targetList.children[selectedItemIndex].scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        this.emitEvent();
      }
    }
  }

  moveBottom() {
    if (!isBlank(this.targetModel) && this.target.length > 1) {
      const selectedItemIndex = this.target.findIndex(x => x.id === this.targetModel);
      if (selectedItemIndex !== (this.target.length - 1)) {
        arrayMove(this.target, selectedItemIndex, this.target.length);
        this.targetList.scrollTop = this.targetList.scrollHeight;

        this.emitEvent();
      }
    }
  }

  filterSource() {
    if (this.source && this.source.length && this.target && this.target.length) {
      this._source = this.source.filter(x => this.target.every(t => t.id !== x.id));
    }
  }

  get isBlankSourceModel() {
    return isBlank(this.sourceModel);
  }

  get isBlankTargetModel() {
    return isBlank(this.targetModel);
  }

  onDragStart(event: DragEvent, index: number) {
    event.dataTransfer.setData('text', index.toString());
    event.dataTransfer.effectAllowed = 'move';
    this.dragElementEvent = { event, index };
  }

  onDropSource(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.source, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.target, this.source, event.previousIndex, event.currentIndex);
    }
    this.targetModel = null;

    this.emitEvent();
  }

  onDropTarget(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.target, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.source, this.target, event.previousIndex, event.currentIndex);
    }
    this.sourceModel = null;

    this.emitEvent();
  }

  private emitEvent() {
    this.dispatchEvent(new CustomEvent('targetChange', { detail: this.target }));
  }

  private createListContent(items: SelectItem[]): HTMLElement[] {
    const elements = [];
    items.forEach(item => {
      const element = document.createElement('div');
      element.classList.add('dt-list-menu-item');
      element.textContent = item.name;
      element.dataset.id = item.id;
      elements.push(element);
    });
    return elements;
  }

  private renderSourceListItems() {
    const elements = this.createListContent(this.source);
    this.sourceList.append(...elements);
  }

  private renderTargetList() {
    const elements = this.createListContent(this.target);
    this.targetList.append(...elements);
  }

  private onClickSourceList() {

  }

  private onClickTargetList() {

  }

}

customElements.define('web-dual-list-box', DualListBoxComponent);
