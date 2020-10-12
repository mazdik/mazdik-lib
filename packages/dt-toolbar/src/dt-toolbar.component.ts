import { downloadCSV, Keys, Listener, toggleClass } from '@mazdik-lib/common';
import { DataTable, Row } from '@mazdik-lib/data-table';
import { Dropdown } from '@mazdik-lib/dropdown';
import './dt-column-toggler.component';
import { DtColumnTogglerComponent } from './dt-column-toggler.component';

export class DtToolbarComponent extends HTMLElement {

  get table(): DataTable { return this._table; }
  set table(val: DataTable) {
    this._table = val;
    this.onInitTable();
  }
  private _table: DataTable;

  get globalFilter(): boolean  { return this._globalFilter; }
  set globalFilter(val: boolean) {
    this._globalFilter = val;
    this.updateStyles();
  }
  private _globalFilter: boolean;

  get createAction(): boolean { return this._createAction; }
  set createAction(val: boolean) {
    this._createAction = val;
    this.updateStyles();
  }
  private _createAction: boolean;

  get exportAction(): boolean { return this._exportAction }
  set exportAction(val: boolean) {
    this._exportAction = val;
    this.updateStyles();
  }
  private _exportAction: boolean;

  get columnToggleAction(): boolean { return this._columnToggleAction }
  set columnToggleAction(val: boolean) {
    this._columnToggleAction = val;
    this.updateStyles();
  }
  private _columnToggleAction: boolean;

  get clearAllFiltersAction(): boolean { return this._clearAllFiltersAction }
  set clearAllFiltersAction(val: boolean) {
    this._clearAllFiltersAction = val;
    this.updateStyles();
  }
  private _clearAllFiltersAction: boolean;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private createWrapper: HTMLElement;
  private createButton: HTMLButtonElement;
  private filterWrapper: HTMLElement;
  private filterInput: HTMLInputElement;
  private filterButton: HTMLButtonElement;
  private dropdownWrapper: HTMLElement;
  private dropdownButton: HTMLButtonElement;
  private columnToggleMenu: HTMLElement;
  private exportMenu: HTMLElement;
  private clearAllFiltersMenu: HTMLElement;
  private dropdown: Dropdown;
  private dtColumnToggler: DtColumnTogglerComponent;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.dropdown.destroy();
    this.removeEventListeners();
  }

  private onInit() {
    this.classList.add('dt-toolbar');

    // createAction
    this.createWrapper = document.createElement('div');
    this.createWrapper.classList.add('dt-toolbar-col');
    this.append(this.createWrapper);

    this.createButton = document.createElement('button');
    this.createButton.classList.add('dt-button');
    this.createWrapper.append(this.createButton);

    // globalFilter
    this.filterWrapper = document.createElement('div');
    this.filterWrapper.classList.add('dt-toolbar-col', 'dt-global-filter');
    this.append(this.filterWrapper);

    const inputGroup = document.createElement('div');
    inputGroup.classList.add('dt-input-group');
    this.filterWrapper.append(inputGroup);

    this.filterInput = document.createElement('input');
    this.filterInput.classList.add('dt-input');
    inputGroup.append(this.filterInput);

    this.filterButton = document.createElement('button');
    this.filterButton.classList.add('dt-button');
    inputGroup.append(this.filterButton);

    // menu
    this.dropdownWrapper = document.createElement('div');
    this.dropdownWrapper.classList.add('dt-toolbar-col');
    this.append(this.dropdownWrapper);

    this.dropdownButton = document.createElement('button');
    this.dropdownButton.classList.add('dt-button');
    this.dropdownWrapper.append(this.dropdownButton);

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dt-context-menu');
    this.dropdownWrapper.append(dropdownMenu);

    this.columnToggleMenu = document.createElement('div');
    this.columnToggleMenu.classList.add('dt-list-menu-item');
    dropdownMenu.append(this.columnToggleMenu);

    this.exportMenu = document.createElement('div');
    this.exportMenu.classList.add('dt-list-menu-item');
    dropdownMenu.append(this.exportMenu);

    this.clearAllFiltersMenu = document.createElement('div');
    this.clearAllFiltersMenu.classList.add('dt-list-menu-item');
    dropdownMenu.append(this.clearAllFiltersMenu);

    this.dropdown = new Dropdown([this.dropdownWrapper]);

    // dtColumnToggler
    this.dtColumnToggler = document.createElement('web-dt-column-toggler') as DtColumnTogglerComponent;
    this.append(this.dtColumnToggler);

    this.updateStyles();

    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'input',
        target: this.filterInput,
        handler: this.onInputGlobalSearch.bind(this)
      },
      {
        eventName: 'keypress',
        target: this.filterInput,
        handler: this.onKeyPressGlobalSearch.bind(this)
      },
      {
        eventName: 'click',
        target: this.filterButton,
        handler: this.onClickGlobalSearch.bind(this)
      },
      {
        eventName: 'click',
        target: this.createButton,
        handler: this.onClickCreateAction.bind(this)
      },
      {
        eventName: 'clickElement',
        target: this.dropdownWrapper,
        handler: this.onClickDropdown.bind(this)
      },
      {
        eventName: 'click',
        target: this.columnToggleMenu,
        handler: this.onClickColumnToggleMenu.bind(this)
      },
      {
        eventName: 'click',
        target: this.exportMenu,
        handler: this.downloadCsv.bind(this)
      },
      {
        eventName: 'click',
        target: this.clearAllFiltersMenu,
        handler: this.clearAllFilters.bind(this)
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

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private onInitTable() {
    this.filterInput.placeholder = this.table.messages.search;
    this.filterInput.value = this.table.dataFilter.globalFilterValue;
    this.filterButton.textContent = this.table.messages.go;
    this.createButton.textContent = this.table.messages.create;

    const text = document.createTextNode(this.table.messages.actions);
    this.dropdownButton.append(text);
    const icon = document.createElement('i');
    icon.classList.add('dt-icon-node');
    this.dropdownButton.append(icon);

    this.columnToggleMenu.textContent = this.table.messages.columns;
    this.exportMenu.textContent = this.table.messages.export;
    this.clearAllFiltersMenu.textContent = this.table.messages.clearFilters;

    this.dtColumnToggler.table = this.table;

    this.addListener({
      eventName: 'filter',
      target: this.table.events.element,
      handler: this.onFilter.bind(this)
    });
  }

  private updateStyles() {
    this.filterWrapper.style.display = this.globalFilter ? 'block' : 'none';
    this.createWrapper.style.display = this.createAction ? 'block' : 'none';
    const enableDropdow = this.exportAction || this.columnToggleAction || this.clearAllFiltersAction;
    this.dropdownWrapper.style.display = enableDropdow ? 'block' : 'none';
    this.columnToggleMenu.style.display = this.columnToggleAction ? 'block' : 'none';
    this.exportMenu.style.display = this.exportAction ? 'block' : 'none';
    this.clearAllFiltersMenu.style.display = this.clearAllFiltersAction ? 'block' : 'none';
  }

  private onInputGlobalSearch(event) {
    this.table.dataFilter.globalFilterValue = event.target.value;
  }

  private onKeyPressGlobalSearch(event: KeyboardEvent) {
    if (event.which === Keys.ENTER) {
      this.table.events.emitFilter();
    }
  }

  private onClickGlobalSearch() {
    this.table.events.emitFilter();
  }

  private onFilter() {
    if (this.filterInput) {
      this.filterInput.value = this.table.dataFilter.globalFilterValue;
    }
  }

  private downloadCsv() {
    const keys = this.table.columns.map(col => col.name);
    const titles = this.table.columns.map(col => col.title);

    const resultRows = [];
    this.table.rows.forEach((x: Row) => {
      const row = x.clone();
      this.table.columns.forEach(col => {
        row[col.name] = col.getValueView(row);
      });
      resultRows.push(row);
    });

    downloadCSV({rows: resultRows, keys, titles});
  }

  private onClickCreateAction() {
    this.dispatchEvent(new CustomEvent('createAction'));
  }

  private onClickDropdown() {
    toggleClass(this.clearAllFiltersMenu, 'disabled', !this.table.dataFilter.hasFilters())
  }

  private clearAllFilters() {
    if (this.table.dataFilter.hasFilters()) {
      this.table.dataFilter.clear();
      this.table.events.emitFilter();
    }
  }

  private onClickColumnToggleMenu() {
    this.dtColumnToggler.open();
  }

}

customElements.define('web-dt-toolbar', DtToolbarComponent);
