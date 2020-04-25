export interface SelectItem {
  id: any;
  name: string;
  parentId?: any;
}

interface Listener {
  eventName: string;
  target: HTMLElement | Window;
  handler: (event: Event) => void;
  options?: AddEventListenerOptions | boolean;
}

function getTemplate() {
  return `
  <input class="dt-input dt-form-group" id="filterInput">
  <ul class="dt-list-menu dt-list-menu-scroll" id="listMenu">
    <li class="dt-list-menu-item" id="selectAll" data-id="-1">
      <span class="dt-checkbox">
        <input type="checkbox" id="checkboxAll"/>
        <label></label>
      </span>
    </li>
    <li class="dt-list-divider"></li>
  </ul>
  <div class="dt-list-divider"></div>
  <div class="dt-list-menu-row">
    <button class="dt-button dt-button-sm" id="okButton"></button>
    <button class="dt-button dt-button-sm" id="cancelButton"></button>
    <button class="dt-button dt-button-sm" id="clearButton"></button>
  </div>
  `;
}

function getTemplateSingle(option: SelectItem) {
  return `
  <li class="dt-list-menu-item" data-id="${option.id}">
    <i class="dt-icon"></i>${option.name}
  </li>`;
}

function getTemplateMultiple(option: SelectItem) {
  return `
  <li class="dt-list-menu-item" data-id="${option.id}">
    <span class="dt-checkbox">
      <input type="checkbox"/>
      <label>${option.name}</label>
    </span>
  </li>`;
}

export class SelectListComponent extends HTMLElement {

  multiple: boolean;
  selectAllMessage: string = 'Select all';
  cancelMessage: string = 'Cancel';
  clearMessage: string = 'Clear';
  searchMessage: string = 'Search...';

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.contentInit();
    this.render();
  }
  private _options: SelectItem[];

  get model(): any[] { return this._model; }
  set model(val: any[]) {
    this._model = val;
    this.selectedOptions = (val && val.length) ? val.slice(0) : [];
    this.refreshStyles();
  }
  private _model: any[] = [];

  get isOpen(): boolean { return this._isOpen; }
  set isOpen(val: boolean) {
    this._isOpen = val;
    if (val === true) {
      this.setFocus();
      this.searchFilterText = null;
      this.filterInput.value = '';
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

  private searchFilterText: string = null;
  private selectedOptions: any[] = [];
  private filteredOptions: SelectItem[];

  private listeners: Listener[] = [];

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = getTemplate();
    this.appendChild(template.content.cloneNode(true));

    this.filterInput = this.querySelector('#filterInput');
    this.selectAll = this.querySelector('#selectAll');
    this.checkboxAll = this.querySelector('#checkboxAll');
    this.listMenu = this.querySelector('#listMenu');
    this.okButton = this.querySelector('#okButton');
    this.cancelButton = this.querySelector('#cancelButton');
    this.clearButton = this.querySelector('#clearButton');

    this.contentInit();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
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

  removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
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

  setSelected(value: any) {
    this.setSelectedOptions(value);
    if (!this.multiple) {
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

  onInputFilter(event: InputEvent) {
    this.searchFilterText = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.filterOptionsByName(this.searchFilterText);
    this.render();
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

  private contentInit() {
    this.filterInput.placeholder = this.searchMessage;
    this.okButton.textContent = 'OK';
    this.cancelButton.textContent = this.cancelMessage;
    this.clearButton.textContent = this.clearMessage;
    this.checkboxAll.nextElementSibling.textContent = this.selectAllMessage;
    if (!this.multiple) {
      this.okButton.style.display = 'none';
      this.selectAll.style.display = 'none';
    }
  }

  private render() {
    this.removeListContent();
    const listContent = this.createListContent().join('');
    this.listMenu.insertAdjacentHTML('beforeend', listContent);
    this.refreshStyles();
  }

  private createListContent(): string[] {
    const result = [];
    this.viewOptions.forEach(option => {
      let element;
      if (this.multiple) {
        element = getTemplateMultiple(option);
      } else {
        element = getTemplateSingle(option);
      }
      result.push(element);
    });
    return result;
  }

  private getDataId(target: HTMLElement): number {
    const el = target.tagName === 'LI' ? target : target.closest('li');
    return (el && el.dataset.id) ? parseInt(el.dataset.id, 10): null;
  }

  private get listContent(): Element[] {
    return Array.from(this.listMenu.children);
  }

  private onClickListMenu(event: MouseEvent) {
    const id = this.getDataId(event.target as HTMLElement);
    if (id !== null && id !== undefined) {
      event.stopPropagation();
      if (id < 0) {
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
    if (this.multiple) {
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
    if (this.multiple) {
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

  private removeListContent() {
    this.listContent.forEach((element: HTMLElement) => {
      const id = this.getDataId(element);
      if (id !== null && id !== undefined && id !== -1) {
        element.remove();
      }
    });
  }

}

customElements.define('web-select-list', SelectListComponent);
