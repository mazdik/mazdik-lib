import { DropDown } from '@mazdik-lib/dropdown';
import { SelectItem, Listener } from '@mazdik-lib/common';
import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { DropdownSelectSettings } from './dropdown-select.settings';

function getTemplate(id: string) {
  return `
  <div class="dt-input-group" id="inputGroup${id}">
    <input class="dt-input dt-select-input" id="input${id}" readonly="readonly">
    <button class="dt-button dt-white" id="button${id}">
      <i class="dt-icon"></i>
    </button>
  </div>
  <div class="dt-dropdown-select-list" id="dropdownContent${id}">
    <web-select-list id="selectList${id}"></web-select-list>
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
  selectedName: string = null;

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
    this.selectList = document.querySelector('#selectList'+id) as SelectListComponent;
    this.inputGroup = this.querySelector('#inputGroup'+id);
    this.dropdownContent = this.querySelector('#dropdownContent'+id);
    this.input = this.querySelector('#input'+id);
    this.button = this.querySelector('#button'+id);

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
      if (this.settings.multiple && items.length > 1) {
        return this.settings.selectedMessage + ': ' + items.length;
      } else {
        const option = this.options.find((x) => {
          return x.id === items[0];
        });
        return (option) ? option.name : '';
      }
    }
  }

  selectionChangeEmit(items: any) {
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

    this.input.value = this.selectedName;
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
