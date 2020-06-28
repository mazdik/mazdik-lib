import { SelectItem, Listener } from '@mazdik-lib/common';
import { SelectListSettings } from './select-list.settings';

function getTemplate(id: string) {
  return `
  <input class="dt-input dt-form-group" id="filterInput${id}">
  <ul class="dt-list-menu dt-list-menu-scroll" id="listMenu${id}"></ul>
  <div class="dt-list-menu-row">
    <button class="dt-button dt-button-sm" id="okButton${id}"></button>
    <button class="dt-button dt-button-sm" id="cancelButton${id}"></button>
    <button class="dt-button dt-button-sm" id="clearButton${id}"></button>
  </div>
  `;
}

export class SelectListComponent extends HTMLElement {

  get settings(): SelectListSettings { return this._settings; }
  set settings(val: SelectListSettings) {
    this._settings = new SelectListSettings(val);
    this.contentInit();
  }
  private _settings: SelectListSettings = new SelectListSettings();

  get options(): SelectItem[] { return this._options || []; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.render();
  }
  private _options: SelectItem[];

  get model(): string[] { return this._model; }
  set model(val: string[]) {
    this._model = val;
    this.selectedOptions = (val && val.length) ? val.slice(0) : [];
    this.refreshStyles();
  }
  private _model: string[] = [];

  get isOpen(): boolean { return this._isOpen; }
  set isOpen(val: boolean) {
    this._isOpen = val;
    if (val === true) {
      this.setFocus();
      this.filterInput.value = '';
      this.render();
    }
  }
  private _isOpen: boolean;

  private filterInput: HTMLInputElement;
  private selectAll: HTMLElement;
  private checkboxAll: HTMLInputElement;
  private listMenu: HTMLElement;
  private okButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;
  private clearButton: HTMLButtonElement;

  private selectedOptions: string[] = [];
  private filteredOptions: SelectItem[];

  private listeners: Listener[] = [];
  private isInitialized: boolean;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.append(template.content.cloneNode(true));

    this.filterInput = this.querySelector('#filterInput'+id);
    this.listMenu = this.querySelector('#listMenu'+id);
    this.okButton = this.querySelector('#okButton'+id);
    this.cancelButton = this.querySelector('#cancelButton'+id);
    this.clearButton = this.querySelector('#clearButton'+id);

    this.createElements();
    this.contentInit();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'input',
        target: this.filterInput,
        handler: this.onInputFilter.bind(this)
      },
      {
        eventName: 'click',
        target: this.okButton,
        handler: this.onClickOk.bind(this)
      },
      {
        eventName: 'click',
        target: this.cancelButton,
        handler: this.onClickCancel.bind(this)
      },
      {
        eventName: 'click',
        target: this.clearButton,
        handler: this.onClickClear.bind(this)
      },
      {
        eventName: 'click',
        target: this.listMenu,
        handler: this.onClickListMenu.bind(this)
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

  setSelectedOptions(value: string) {
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.settings.multiple) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions = [];
        this.selectedOptions.push(value);
      }
    }
  }

  setSelected(value: string) {
    this.setSelectedOptions(value);
    if (!this.settings.multiple) {
      this.selectionChangeEmit();
    }
  }

  setSelectedAll() {
    if (this.allSelected) {
      this.selectedOptions = [];
    } else {
      this.checkAll();
    }
  }

  checkAll() {
    this.selectedOptions = this.options.map(option => option.id);
    if (!this.settings.multiple) {
      this.selectionChangeEmit();
    }
  }

  isSelected(value: string): boolean {
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
    this.refreshStyles();
  }

  onClickClear(event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedOptions.length > 0) {
      this.selectedOptions = [];
    }
    this.selectionChangeEmit();
    this.refreshStyles();
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

  selectionChangeEmit() {
    if (this.model.length === this.selectedOptions.length && this.model.every((value, index) => value === this.selectedOptions[index])) {
      this.dispatchEvent(new CustomEvent('selectionCancel', { detail: true }));
    } else {
      this.model = this.selectedOptions.slice(0);
      this.dispatchEvent(new CustomEvent('selectionChange', { detail: this.model }));
    }
  }

  onInputFilter() {
    this.filteredOptions = this.filterOptionsByName(this.filterInput.value);
    this.render();
  }

  get viewOptions(): SelectItem[] {
    return (this.filterInput.value) ? this.filteredOptions : this.options;
  }

  filterOptionsByName(value: string): SelectItem[] {
    if (!value || !this.options) {
      return this.options;
    }
    return this.options.filter(val => val.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  private createElements() {
    this.selectAll = document.createElement('li');
    this.selectAll.classList.add('dt-list-menu-item', 'dt-list-menu-select-all');
    this.selectAll.dataset.id = '-1';

    const span = document.createElement('span');
    span.classList.add('dt-checkbox');
    this.selectAll.append(span);

    this.checkboxAll = document.createElement('input');
    this.checkboxAll.type = 'checkbox';
    span.append(this.checkboxAll);
    const label = document.createElement('label');
    span.append(label);
  }

  private contentInit() {
    this.filterInput.placeholder = this.settings.searchMessage;
    this.okButton.textContent = 'OK';
    this.cancelButton.textContent = this.settings.cancelMessage;
    this.clearButton.textContent = this.settings.clearMessage;
    this.checkboxAll.nextElementSibling.textContent = this.settings.selectAllMessage;
    this.okButton.style.display = this.settings.multiple ? 'block' : 'none';
    this.selectAll.style.display = (this.settings.multiple && this.settings.enableSelectAll) ? 'block' : 'none';
    this.filterInput.style.display = this.settings.enableFilterInput ? 'block' : 'none';
  }

  private render() {
    this.listMenu.innerHTML = '';
    this.listMenu.append(this.selectAll);
    this.listMenu.append(...this.createListContent());
    this.refreshStyles();
  }

  private createListContent(): HTMLElement[] {
    const result = [];
    this.viewOptions.forEach(option => {
      const element = document.createElement('li');
      element.classList.add('dt-list-menu-item');
      element.dataset.id = option.id;
      if (this.settings.multiple) {
        element.append(this.createMultipleElement(option));
      } else {
        const icon = document.createElement('i');
        icon.classList.add('dt-icon');
        element.append(icon);

        const text = document.createTextNode(option.name);
        element.append(text);
      }
      result.push(element);
    });
    return result;
  }

  private createMultipleElement(option: SelectItem): HTMLElement {
    const span = document.createElement('span');
    span.classList.add('dt-checkbox');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    span.append(checkbox);
    const label = document.createElement('label');
    label.textContent = option.name;
    span.append(label);

    return span;
  }

  private getDataId(target: HTMLElement): string {
    const el = target.tagName === 'LI' ? target : target.closest('li');
    return (el && el.dataset.id) ? el.dataset.id: null;
  }

  private get listContent(): Element[] {
    return Array.from(this.listMenu.children);
  }

  private onClickListMenu(event: MouseEvent) {
    const id = this.getDataId(event.target as HTMLElement);
    if (id !== null && id !== undefined) {
      event.stopPropagation();
      if (id === '-1') {
        this.setSelectedAll();
      } else {
        this.setSelected(id);
      }
      this.refreshStyles();
    }
  }

  private refreshStyles() {
    this.listContent.forEach((element: HTMLElement) => {
      const id = this.getDataId(element);
      if (this.isSelected(id)) {
        this.addActiveStyles(element);
      } else {
        this.removeActiveStyles(element);
      }
    });
    this.checkboxAll.checked = this.allSelected;
    this.checkboxAll.indeterminate = this.partiallySelected;
  }

  private addActiveStyles(element: HTMLElement) {
    if (!element.firstElementChild) {
      return;
    }
    if (this.settings.multiple) {
      this.setInputChecked(element, true);
    } else {
      element.classList.add('active');
      element.firstElementChild.classList.add('dt-icon-ok');
    }
  }

  private removeActiveStyles(element: HTMLElement) {
    if (!element.firstElementChild) {
      return;
    }
    if (this.settings.multiple) {
      this.setInputChecked(element, false);
    } else {
      element.classList.remove('active');
      element.firstElementChild.classList.remove('dt-icon-ok');
    }
  }

  private setInputChecked(element: HTMLElement, checked: boolean) {
    const input = element.firstElementChild.firstElementChild as HTMLInputElement;
    input.checked = checked;
  }

}

customElements.define('web-select-list', SelectListComponent);
