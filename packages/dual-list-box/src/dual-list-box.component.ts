import { SelectItem, isBlank, arrayMove, arrayTransfer, Listener, toggleClass } from '@mazdik-lib/common';
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
  <button class="dt-button" id="moveRightAllButton${id}" title="move all to the right">
    <i class="dt-icon-quotation-r large"></i>
  </button>
  <button class="dt-button" id="moveRightButton${id}" title="move selected to the right">
    <i class="dt-icon-arrow-right large"></i>
  </button>
  <button class="dt-button" id="moveLeftButton${id}" title="move selected to the left">
    <i class="dt-icon-arrow-left large"></i>
  </button>
  <button class="dt-button" id="moveLeftAllButton${id}" title="move all to the left">
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
  <button class="dt-button" id="moveTopButton${id}" title="move top">
    <i class="dt-icon-tab-up large"></i>
  </button>
  <button class="dt-button" id="moveUpButton${id}" title="move up">
    <i class="dt-icon-arrow-up large"></i>
  </button>
  <button class="dt-button" id="moveDownButton${id}" title="move down">
    <i class="dt-icon-arrow-down large"></i>
  </button>
  <button class="dt-button" id="moveBottomButton${id}" title="move bottom">
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
    this.sourceElements = this.createListContent(value);
    this.renderSourceList();
  }
  private _source: SelectItem[];

  get target(): SelectItem[] { return this._target; }
  set target(value: SelectItem[]) {
    this._target = value;
    this.filterSource();
    this.targetElements = this.createListContent(value);
    this.renderTargetList();
  }
  private _target: SelectItem[];

  private sourceModel: string;
  private targetModel: string;
  private dragElementEvent: DragElementEvent;

  private sourceList: HTMLElement;
  private targetList: HTMLElement;
  private sourceElements: HTMLElement[] = [];
  private targetElements: HTMLElement[] = [];

  private moveRightAllButton: HTMLButtonElement;
  private moveRightButton: HTMLButtonElement;
  private moveLeftButton: HTMLButtonElement;
  private moveLeftAllButton: HTMLButtonElement;

  private moveTopButton: HTMLButtonElement;
  private moveUpButton: HTMLButtonElement;
  private moveDownButton: HTMLButtonElement;
  private moveBottomButton: HTMLButtonElement;

  private listeners: Listener[] = [];

  constructor() {
    super();
    const id = (~~(Math.random() * 1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.sourceList = this.querySelector('#sourceList' + id);
    this.targetList = this.querySelector('#targetList' + id);

    this.moveRightAllButton = this.querySelector('#moveRightAllButton' + id);
    this.moveRightButton = this.querySelector('#moveRightButton' + id);
    this.moveLeftButton = this.querySelector('#moveLeftButton' + id);
    this.moveLeftAllButton = this.querySelector('#moveLeftAllButton' + id);

    this.moveTopButton = this.querySelector('#moveTopButton' + id);
    this.moveUpButton = this.querySelector('#moveUpButton' + id);
    this.moveDownButton = this.querySelector('#moveDownButton' + id);
    this.moveBottomButton = this.querySelector('#moveBottomButton' + id);

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
      {
        eventName: 'click',
        target: this.moveRightAllButton,
        handler: this.moveRightAll.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveRightButton,
        handler: this.moveRight.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveLeftButton,
        handler: this.moveLeft.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveLeftAllButton,
        handler: this.moveLeftAll.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveTopButton,
        handler: this.moveTop.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveUpButton,
        handler: this.moveUp.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveDownButton,
        handler: this.moveDown.bind(this)
      },
      {
        eventName: 'click',
        target: this.moveBottomButton,
        handler: this.moveBottom.bind(this)
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

  private moveRight() {
    if (!isBlank(this.sourceModel) && !isBlank(this.sourceElements)) {
      const selectedItemIndex = this.sourceElements.findIndex(x => x.dataset.id === this.sourceModel);
      arrayTransfer(this.sourceElements, this.targetElements, selectedItemIndex, this.targetElements.length);
      this.sourceModel = null;

      this.emitEvent();
    }
  }

  private moveRightAll() {
    if (!isBlank(this.sourceElements)) {
      this.targetElements = [...this.targetElements, ... this.sourceElements];
      this.sourceElements = [];
      this.sourceModel = null;

      this.emitEvent();
    }
  }

  private moveLeft() {
    if (!isBlank(this.targetModel) && !isBlank(this.targetElements)) {
      const selectedItemIndex = this.targetElements.findIndex(x => x.dataset.id === this.targetModel);
      arrayTransfer(this.targetElements, this.sourceElements, selectedItemIndex, this.sourceElements.length);
      this.targetModel = null;

      this.emitEvent();
    }
  }

  private moveLeftAll() {
    if (!isBlank(this.targetElements)) {
      this.targetElements.forEach(item => this.sourceElements.push(item));
      this.targetElements = [];
      this.targetModel = null;

      this.emitEvent();
    }
  }

  private moveUp() {
    if (!isBlank(this.targetModel) && this.targetElements.length > 1) {
      const selectedItemIndex = this.targetElements.findIndex(x => x.dataset.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        arrayMove(this.targetElements, selectedItemIndex, selectedItemIndex - 1);
        if (this.targetList.children[selectedItemIndex]) {
          this.targetList.children[selectedItemIndex].scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        this.emitEvent();
      }
    }
  }

  private moveTop() {
    if (!isBlank(this.targetModel) && this.targetElements.length > 1) {
      const selectedItemIndex = this.targetElements.findIndex(x => x.dataset.id === this.targetModel);
      if (selectedItemIndex !== 0) {
        arrayMove(this.targetElements, selectedItemIndex, 0);
        this.targetList.scrollTop = 0;

        this.emitEvent();
      }
    }
  }

  private moveDown() {
    if (!isBlank(this.targetModel) && this.targetElements.length > 1) {
      const selectedItemIndex = this.targetElements.findIndex(x => x.dataset.id === this.targetModel);
      if (selectedItemIndex !== (this.targetElements.length - 1)) {
        arrayMove(this.targetElements, selectedItemIndex, selectedItemIndex + 1);
        if (this.targetList.children[selectedItemIndex]) {
          this.targetList.children[selectedItemIndex].scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        this.emitEvent();
      }
    }
  }

  private moveBottom() {
    if (!isBlank(this.targetModel) && this.targetElements.length > 1) {
      const selectedItemIndex = this.targetElements.findIndex(x => x.dataset.id === this.targetModel);
      if (selectedItemIndex !== (this.targetElements.length - 1)) {
        arrayMove(this.targetElements, selectedItemIndex, this.targetElements.length);
        this.targetList.scrollTop = this.targetList.scrollHeight;

        this.emitEvent();
      }
    }
  }

  private filterSource() {
    if (this.source && this.source.length && this.target && this.target.length) {
      this._source = this.source.filter(x => this.target.every(t => t.id !== x.id));
    }
  }

  private onDragStart(event: DragEvent, index: number) {
    event.dataTransfer.setData('text', index.toString());
    event.dataTransfer.effectAllowed = 'move';
    this.dragElementEvent = { event, index };
  }

  private onDropSource(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.sourceElements, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.targetElements, this.sourceElements, event.previousIndex, event.currentIndex);
    }
    this.targetModel = null;

    this.emitEvent();
  }

  private onDropTarget(event: DropElementEvent) {
    if (event.type === 'reorder') {
      arrayMove(this.targetElements, event.previousIndex, event.currentIndex);
    } else {
      arrayTransfer(this.sourceElements, this.targetElements, event.previousIndex, event.currentIndex);
    }
    this.sourceModel = null;

    this.emitEvent();
  }

  private emitEvent() {
    this.renderLists();
    const all = [...this.source, ...this.target];
    const resultTarget = this.targetElements.map(x => all.find(t => t.id === x.dataset.id));
    this.dispatchEvent(new CustomEvent('targetChange', { detail: resultTarget }));
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

  private renderSourceList() {
    this.sourceList.innerHTML = '';
    this.sourceList.append(...this.sourceElements);
    this.updateStyles();
  }

  private renderTargetList() {
    this.targetList.innerHTML = '';
    this.targetList.append(...this.targetElements);
    this.updateStyles();
  }

  private renderLists() {
    this.renderSourceList();
    this.renderTargetList();
  }

  private onClickSourceList(event: MouseEvent) {
    const element = this.getListItemElement(event);
    if (!element) {
      return;
    }
    event.stopPropagation();
    this.sourceModel = element.dataset.id;
    this.updateStyles();
  }

  private onClickTargetList(event: MouseEvent) {
    const element = this.getListItemElement(event);
    if (!element) {
      return;
    }
    event.stopPropagation();
    this.targetModel = element.dataset.id;
    this.updateStyles();
  }

  private getListItemElement(event: MouseEvent): HTMLElement {
    const target = event.target as HTMLElement;
    const element = target.classList.contains('dt-list-menu-item') ? target : target.closest('.dt-list-menu-item') as HTMLElement;
    return element;
  }

  private updateStyles() {
    this.sourceElements.forEach(element => {
      toggleClass(element, 'active', element.dataset.id === this.sourceModel);
    });
    this.targetElements.forEach(element => {
      toggleClass(element, 'active', element.dataset.id === this.targetModel);
    });
    const isBlankTargetModel = isBlank(this.targetModel);
    this.moveRightButton.disabled = isBlank(this.sourceModel)
    this.moveLeftButton.disabled = isBlankTargetModel;
    this.moveTopButton.disabled = isBlankTargetModel;
    this.moveUpButton.disabled = isBlankTargetModel;
    this.moveDownButton.disabled = isBlankTargetModel;
    this.moveBottomButton.disabled = isBlankTargetModel;
  }

}

customElements.define('web-dual-list-box', DualListBoxComponent);
