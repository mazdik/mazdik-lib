
interface SelectItem {
  id: any;
  name: string;
  parentId?: any;
}

function getTemplate() {
  return `
  <input class="dt-input dt-form-group"
        #filterInput
        placeholder="{{searchMessage}}"
        [value]="searchFilterText"
        (input)="onInputFilter($event)">

  <ul class="dt-list-menu dt-list-menu-scroll">
      <li class="dt-list-menu-item" *ngIf="multiple" (click)="onCheckboxAllClick($event)">
        <span class="dt-checkbox">
          <input type="checkbox"
                [checked]="allSelected"
                [indeterminate]="partiallySelected"/>
          <label>{{selectAllMessage}}</label>
        </span>
      </li>
      <li class="dt-list-divider"></li>

      <ng-container *ngIf="!multiple">
        <li class="dt-list-menu-item"
          *ngFor="let option of viewOptions"
          (click)="setSelected($event, option.id)"
          [ngClass]="{'active': isSelected(option.id)}">
          <i class="dt-icon" [class.dt-icon-ok]="isSelected(option.id)"></i>&nbsp;&nbsp;{{option.name}}
        </li>
      </ng-container>

      <ng-container *ngIf="multiple">
        <li class="dt-list-menu-item"
          *ngFor="let option of viewOptions"
          (click)="setSelected($event, option.id)">
          <span class="dt-checkbox">
              <input type="checkbox" [checked]="isSelected(option.id)"/>
              <label>{{option.name}}</label>
          </span>
        </li>
      </ng-container>
  </ul>

  <div class="dt-list-divider"></div>
  <div class="dt-list-menu-row">
    <button class="dt-button dt-button-sm" (click)="onClickOk($event)" *ngIf="multiple">OK</button>
    <button class="dt-button dt-button-sm" (click)="onClickCancel($event)">{{cancelMessage}}</button>
    <button class="dt-button dt-button-sm" (click)="onClickClear($event)">{{clearMessage}}</button>
  </div>
  `;
}

export class SelectListComponent extends HTMLElement {

  options: SelectItem[];
  multiple: boolean;
  selectAllMessage: string = 'Select all';
  cancelMessage: string = 'Cancel';
  clearMessage: string = 'Clear';
  searchMessage: string = 'Search...';

  get model(): any[] { return this._model; }
  set model(val: any[]) {
    this._model = val;
    this.selectedOptions = (val && val.length) ? val.slice(0) : [];
  }
  private _model: any[] = [];

  get isOpen(): boolean { return this._isOpen; }
  set isOpen(val: boolean) {
    this._isOpen = val;
    if (val === true) {
      this.setFocus();
      this.searchFilterText = null;
    }
  }
  private _isOpen: boolean;

  private filterInput: HTMLElement;
  private searchFilterText: string = null;
  private selectedOptions: any[] = [];
  private filteredOptions: SelectItem[];

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = getTemplate();
    this.appendChild(template.content.cloneNode(true));

    this.filterInput = this.querySelector('#filterInput');
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  setSelectedOptions(value: any) {
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.multiple) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions = [];
        this.selectedOptions.push(value);
      }
    }
  }

  setSelected(event: MouseEvent, value: any) {
    event.stopPropagation();
    this.setSelectedOptions(value);
    if (!this.multiple) {
      this.selectionChangeEmit();
    }
  }

  checkAll() {
    this.selectedOptions = this.options.map(option => option.id);
    if (!this.multiple) {
      this.selectionChangeEmit();
    }
  }

  isSelected(value: any): boolean {
    return this.selectedOptions.indexOf(value) > -1;
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.focus();
      }, 1);
    }
  }

  onClickOk(event: MouseEvent) {
    event.stopPropagation();
    this.selectionChangeEmit();
  }

  onClickCancel(event: MouseEvent) {
    event.stopPropagation();
    this.selectedOptions = this.model.slice(0);
    this.dispatchEvent(new CustomEvent('selectionCancel', { detail: true }));
  }

  onClickClear(event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedOptions.length > 0) {
      this.selectedOptions = [];
    }
    this.selectionChangeEmit();
  }

  get allSelected(): boolean {
    return (this.options &&
      this.options.length !== 0 &&
      this.selectedOptions &&
      this.selectedOptions.length === this.options.length);
  }

  get partiallySelected(): boolean {
    return this.selectedOptions.length !== 0 && !this.allSelected;
  }

  onCheckboxAllClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.allSelected) {
      this.selectedOptions = [];
    } else {
      this.checkAll();
    }
  }

  selectionChangeEmit() {
    if (this.model.length === this.selectedOptions.length && this.model.every((value, index) => value === this.selectedOptions[index])) {
      this.dispatchEvent(new CustomEvent('selectionCancel', { detail: true }));
    } else {
      this.model = this.selectedOptions.slice(0);
      this.dispatchEvent(new CustomEvent('selectionChange', { detail: this.model }));
    }
  }

  onInputFilter(event: InputEvent) {
    this.searchFilterText = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.filterOptionsByName(this.searchFilterText);
  }

  get viewOptions(): SelectItem[] {
    return (this.searchFilterText) ? this.filteredOptions : this.options;
  }

  filterOptionsByName(value: string): SelectItem[] {
    if (!value || !this.options) {
      return this.options;
    }
    return this.options.filter(val => val.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}

customElements.define('web-select-list', SelectListComponent);
