import { DropDown } from '@mazdik-lib/dropdown';
import { SelectItem, Listener } from '@mazdik-lib/common';
import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { DropdownSelectSettings } from './dropdown-select.settings';

function getTemplate(id: string) {
  return `
  <div class="dt-input-group" id="inputGroup${id}">
    <input class="dt-input dt-select-input" readonly="readonly">
    <button class="dt-button dt-white">
      <i class="dt-icon"></i>
    </button>
  </div>
  <div class="dt-dropdown-select-list" id="dropdownContent${id}">
    <web-select-list></web-select-list>
  </div>
  `;
}

export class DropdownSelectComponent extends HTMLElement {

  get settings(): DropdownSelectSettings { return this._settings; }
  set settings(val: DropdownSelectSettings) {
    this._settings = new DropdownSelectSettings(val);
    this.selectList.settings = this._settings;
    this.contentInit();
  }
  private _settings: DropdownSelectSettings = new DropdownSelectSettings();

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.input.value = this.getName(this.selectList.model);
    this.selectList.options = val;
  }
  private _options: SelectItem[];

  set value(val: string[] | string) {
    if (Array.isArray(val)) {
      this.selectList.model = [...val];
    } else {
      this.selectList.model = (val) ? [val] : [];
    }
    this.input.value = this.getName(this.selectList.model);
  }

  private dropdown: DropDown;
  private selectList: SelectListComponent;
  private inputGroup: HTMLElement;
  private dropdownContent: HTMLElement;
  private input: HTMLInputElement;
  private button: HTMLButtonElement;

  private listeners: Listener[] = [];

  constructor() {
    super();
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-dropdown-select');
    this.dropdown = new DropDown(this);
    this.selectList = this.querySelector('web-select-list') as SelectListComponent;
    this.inputGroup = this.querySelector('#inputGroup'+id);
    this.dropdownContent = this.querySelector('#dropdownContent'+id);
    this.input = this.querySelector('input');
    this.button = this.querySelector('button');

    this.contentInit();
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
      {
        eventName: 'selectionChange',
        target: this.selectList,
        handler: this.onSelectionChange.bind(this)
      },
      {
        eventName: 'selectionCancel',
        target: this.selectList,
        handler: this.onSelectionCancel.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  open(event: MouseEvent) {
    event.stopPropagation();
    if (!this.settings.disabled) {
      this.dropdown.toggleDropdown();
    }
  }

  onSelectionChange(event: CustomEvent<string[]>) {
    this.input.value = this.getName(event.detail);
    this.selectionChangeEmit(event.detail);
    this.dropdown.closeDropdown();
  }

  onSelectionCancel() {
    this.dropdown.closeDropdown();
  }

  getName(items: string[]) {
    if (items && items.length && this.options && this.options.length) {
      if (this.settings.multiple && items.length > 1) {
        return this.settings.selectedMessage + ': ' + items.length;
      } else {
        const option = this.options.find(x => x.id === items[0]);
        return (option) ? option.name : '';
      }
    }
    return null;
  }

  selectionChangeEmit(items: string[]) {
    if (!this.settings.multiple) {
      const value = (items && items.length) ? items[0] : null;
      this.dispatchEvent(new CustomEvent('valueChange', { detail: value }));
    } else {
      this.dispatchEvent(new CustomEvent('valueChange', { detail: items }));
    }
  }

  onOpenChange() {
    this.refreshStyles();
    this.selectList.isOpen = this.dropdown.isOpen;
  }

  private contentInit() {
    this.input.placeholder = this.settings.placeholder;
    this.input.disabled = this.settings.disabled;
    this.button.disabled = this.settings.disabled;

    this.refreshStyles();
  }

  private refreshStyles() {
    this.dropdownContent.style.display = this.dropdown.isOpen ? 'block' : 'none';
    if (this.dropdown.isOpen) {
      this.button.firstElementChild.classList.add('asc');
      this.button.firstElementChild.classList.remove('desc');
    } else {
      this.button.firstElementChild.classList.remove('asc');
      this.button.firstElementChild.classList.add('desc');
    }
  }

}

customElements.define('web-dropdown-select', DropdownSelectComponent);
