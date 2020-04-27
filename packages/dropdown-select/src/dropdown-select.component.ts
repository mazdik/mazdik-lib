import { DropDown } from '@mazdik-lib/dropdown';
import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';

// TODO
export interface SelectItem {
  id: string;
  name: string;
  parentId?: string;
}
interface Listener {
  eventName: string;
  target: HTMLElement | Window;
  handler: (event: Event) => void;
  options?: AddEventListenerOptions | boolean;
}

function getTemplate(id: string) {
  return `
  <div class="dt-input-group" id="inputGroup${id}" (click)="open($event)">
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
<div class="dt-dropdown-select-list" id="dropdownContent${id}">
  <web-select-list id="selectList${id}"></web-select-list>
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
  searchMessage: string = 'Search...';
  selectedMessage: string = 'Selected';
  enableSelectAll: boolean = true;
  enableFilterInput: boolean = true;

  set settings(val: any) {
    if (val) {
      this.multiple = val.multiple;
      this.selectAllMessage = val.selectAllMessage || this.selectAllMessage;
      this.cancelMessage = val.cancelMessage || this.cancelMessage;
      this.clearMessage = val.clearMessage || this.clearMessage;
      this.searchMessage = val.searchMessage || this.searchMessage;
    }
  }

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.selectedName = this.getName(this.selectedOptions);
    this.selectList.options = val;
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
    this.selectList.model = this.selectedOptions;
  }

  selectedOptions: string[] = [];
  selectedName: string;

  private dropdown: DropDown;
  private selectList: SelectListComponent;
  private inputGroup: HTMLElement;
  private dropdownContent: HTMLElement;

  private listeners: Listener[] = [];

  constructor() {
    super();
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-dropdown-select');
    this.dropdown = new DropDown(this);
    this.selectList = document.querySelector('#selectList'+id) as SelectListComponent;
    this.inputGroup = this.querySelector('#inputGroup'+id);
    this.dropdownContent = this.querySelector('#dropdownContent'+id);

    this.dropdownContent.style.display = this.dropdown.isOpen ? 'block' : 'none';

    this.addEventListeners();
  }

  disconnectedCallback() {
    this.dropdown.removeEventListeners();

    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  addEventListeners() {
    this.listeners = [
      {
        eventName: 'open',
        target: this,
        handler: this.onOpenChange.bind(this)
      },
      {
        eventName: 'click',
        target: this.inputGroup,
        handler: this.open.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
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

  onOpenChange(event: CustomEvent) {
    console.log(event.detail);
    this.dropdownContent.style.display = this.dropdown.isOpen ? 'block' : 'none';
  }

}

customElements.define('web-dropdown-select', DropdownSelectComponent);
