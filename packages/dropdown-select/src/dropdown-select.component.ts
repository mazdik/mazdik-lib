import { DropDown } from '@mazdik-lib/dropdown';
import '@mazdik-lib/select-list';
import { SelectItem } from '@mazdik-lib/select-list';

// TODO
interface Listener {
  eventName: string;
  target: HTMLElement | Window;
  handler: (event: Event) => void;
  options?: AddEventListenerOptions | boolean;
}

function getTemplate(id: string) {
  return `
  <div class="dt-input-group" (click)="open($event)">
  <input class="dt-input dt-select-input"
         readonly="readonly"
         value="{{selectedName}}"
         placeholder="{{placeholder}}"
         [disabled]="disabled">
  <button class="dt-button dt-white" [disabled]="disabled">
    <i class="dt-icon asc" *ngIf="dropdown.isOpen"></i>
    <i class="dt-icon desc" *ngIf="!dropdown.isOpen"></i>
  </button>
</div>
<div class="dt-dropdown-select-list" *ngIf="dropdown.isOpen">
  <app-select-list
      [options]="options"
      [selected]="selectedOptions"
      [multiple]="multiple"
      [isOpen]="dropdown.isOpen"
      [selectAllMessage]="selectAllMessage"
      [cancelMessage]="cancelMessage"
      [clearMessage]="clearMessage"
      [searchMessage]="searchInputPlaceholder"
      [enableSelectAll]="enableSelectAll"
      [enableFilterInput]="enableFilterInput"
      (selectionChange)="onSelectionChange($event)"
      (selectionCancel)="onSelectionCancel()">
  </app-select-list>
</div>
  `;
}

export class DropdownSelectComponent extends HTMLElement {

  multiple: boolean;
  disabled: boolean;
  selectAllMessage: string = 'Select all';
  cancelMessage: string = 'Cancel';
  clearMessage: string = 'Clear';
  placeholder: string = 'Select';
  searchInputPlaceholder: string = 'Search...';
  selectedMessage: string = 'Selected';
  enableSelectAll: boolean = true;
  enableFilterInput: boolean = true;

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.selectedName = this.getName(this.selectedOptions);
  }
  private _options: SelectItem[];

  set value(val: any) {
    if (Array.isArray(val)) {
      this.selectedOptions = [...val];
    } else {
      this.selectedOptions = [];
      if (val) {
        this.selectedOptions.push(val);
      }
    }
    this.selectedName = this.getName(this.selectedOptions);
  }

  selectedOptions: SelectItem[] = [];
  selectedName: string;
  dropdown: DropDown;

  private listeners: Listener[] = [];

  constructor() {
    super();
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-dropdown-select'); // TODO

    this.addEventListeners();
  }

  disconnectedCallback() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
    this.dropdown.removeEventListeners();
  }

  addEventListeners() {
    //const subDropdown = this.dropdown.isOpenSource$.subscribe(() => {
      //this.cd.markForCheck();
    //});
  }

  open(event: MouseEvent) {
    event.stopPropagation();
    if (!this.disabled) {
      this.dropdown.toggleDropdown();
    }
  }

  onSelectionChange(event) {
    this.selectedName = this.getName(event);
    this.selectionChangeEmit(event);
    this.dropdown.isOpen = false;
  }

  onSelectionCancel() {
    this.dropdown.isOpen = false;
  }

  getName(items: any) {
    if (items && items.length && this.options && this.options.length) {
      if (this.multiple && items.length > 1) {
        return this.selectedMessage + ': ' + items.length;
      } else {
        const option = this.options.find((x) => {
          return x.id === items[0];
        });
        return (option) ? option.name : '';
      }
    }
  }

  selectionChangeEmit(items: any) {
    if (!this.multiple) {
      const value = (items && items.length) ? items[0] : null;
      this.dispatchEvent(new CustomEvent('valueChange', { detail: value }));
    } else {
      this.dispatchEvent(new CustomEvent('valueChange', { detail: items }));
    }
  }

}

customElements.define('web-dropdown-select', DropdownSelectComponent);
