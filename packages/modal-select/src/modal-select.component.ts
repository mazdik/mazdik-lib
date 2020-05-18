import { SelectItem, arrayPaginate, Listener } from '@mazdik-lib/common';
import { ModalComponent } from '@mazdik-lib/modal';
import { PageEvent } from '@mazdik-lib/pagination';

function getTemplate(id: string) {
  return `
<div class="dt-input-group" id="inputGroup${id}" (click)="open()">
  <input class="dt-input dt-select-input"
         readonly="readonly"
         value="{{selectedName}}"
         placeholder="{{placeholder}}"
         [disabled]="disabled">
  <button class="dt-button dt-white" [disabled]="disabled">
    <i class="dt-icon dt-icon-return"></i>
  </button>
</div>

<app-modal #modal>
  <ng-container class="app-modal-header">{{modalTitle}}</ng-container>
  <ng-container class="app-modal-body">
    <div class="dt-select-header">
      <div class="dt-clearable-input">
        <input class="dt-input select-input" id="filterInput${id}"
               placeholder={{searchInputPlaceholder}}
               [value]="searchFilterText"
               (input)="searchFilterText = $event.target.value"
               (keyup)="onFilterKeyup()">
        <span [style.display]="searchFilterText?.length > 0 ? 'block' : 'none' "
              (click)="onClickClearSearch()">&times;</span>
      </div>
    </div>
    <ul class="dt-list-menu">
      <li class="dt-list-menu-item"
          *ngFor="let option of options"
          (click)="setSelected(option)"
          [ngClass]="{'active': isSelected(option)}">
          {{option.name}}
      </li>
    </ul>
  </ng-container>
  <ng-container class="app-modal-footer">
    <app-pagination
        [totalItems]="totalItems"
        [perPage]="itemsPerPage"
        [currentPage]="currentPage"
        (pageChanged)="onPageChanged($event)">
    </app-pagination>
  </ng-container>
</app-modal>
  `;
}

export class ModalSelectComponent extends HTMLElement {

  filterDelay: number = 300;
  disabled: boolean;
  modalTitle: string = 'Search Dialog';
  itemsPerPage: number = 10;
  placeholder: string = 'Select';
  searchInputPlaceholder: string = 'Search...';

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    if (this._options) {
      this.optionsCopy = [...val];
      this.selectedName = this.getName();
      this.dispatchEvent(new CustomEvent('nameChanged', { detail: this.selectedName }));
    }
  }
  private _options: SelectItem[];

  get model() { return this._model; }
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.selectedName = this.getName();
      this.dispatchEvent(new CustomEvent('valueChange', { detail: this._model }));
      this.dispatchEvent(new CustomEvent('nameChanged', { detail: this.selectedName }));
    }
  }
  private _model: any;

  private modal: ModalComponent;

  searchFilterText: string = null;
  currentPage: number = 1;
  sortOrder: number = 1;
  totalItems: number;
  filterTimeout: any;
  selectedName: string;

  private optionsCopy: SelectItem[] = [];
  private listeners: Listener[] = [];

  private inputGroup: HTMLElement;
  private filterInput: HTMLInputElement;

  constructor() {
    super();
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-modal-select');
    this.inputGroup = this.querySelector('#inputGroup'+id);
    this.filterInput = this.querySelector('#filterInput'+id);

    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.inputGroup,
        handler: this.onClickInputGroup.bind(this)
      },
      {
        eventName: 'input',
        target: this.filterInput,
        handler: this.onInputFilter.bind(this)
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

  open() {
    if (!this.disabled) {
      this.searchFilterText = '';
      this.modal.show();
      this._options = this.getOptions();
    }
  }

  onFilterKeyup() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this._options = this.getOptions();
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  getOptions() {
    let data = [];
    if (this.optionsCopy && this.optionsCopy.length && this.searchFilterText) {
      data = this.optionsCopy.filter(x => x.name.toLocaleLowerCase().indexOf(this.searchFilterText.toLocaleLowerCase()) > -1);
      this.currentPage = 1;
    } else {
      data = this.optionsCopy;
    }
    this.totalItems = data.length;
    const result = arrayPaginate(data, this.currentPage, this.itemsPerPage);
    return result;
  }

  onPageChanged(event: PageEvent) {
    this.currentPage = event.currentPage;
    this.itemsPerPage = event.perPage;
    this._options = this.getOptions();
  }

  setSelected(option: SelectItem) {
    this.model = option.id;
    this.modal.hide();
  }

  isSelected(option: SelectItem): boolean {
    return option.id === this.model;
  }

  getName() {
    if (this.optionsCopy) {
      const option = this.optionsCopy.find((x) => {
        return x.id === this.model;
      });
      return (option) ? option.name : '';
    }
  }

  onClickClearSearch() {
    this.searchFilterText = '';
    this.onFilterKeyup();
  }

  private onClickInputGroup() {

  }

  private onInputFilter() {

  }

}

customElements.define('web-modal-select', ModalSelectComponent);
