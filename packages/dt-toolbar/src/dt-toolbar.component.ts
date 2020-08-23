import { downloadCSV, Keys, Listener } from '@mazdik-lib/common';
import { DataTable, Row } from '@mazdik-lib/data-table';


export class DtToolbarComponent extends HTMLElement {

  get table(): DataTable { return this._table; }
  set table(val: DataTable) {
    this._table = val;
  }
  private _table: DataTable;

  get globalFilter(): boolean  { return this._globalFilter; }
  set globalFilter(val: boolean) {
    this._globalFilter = val;
    if (this.table && val) {
      this.createGlobalFilter();
    }
  }
  private _globalFilter: boolean;

  createAction: boolean;
  exportAction: boolean;
  columnToggleAction: boolean;
  clearAllFiltersAction: boolean;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private input: HTMLInputElement;

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
    this.removeEventListeners();
  }

  private onInit() {
    this.classList.add('dt-toolbar');
    //this.addEventListeners();
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

  private createGlobalFilter() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('dt-toolbar-col', 'dt-global-filter');
    this.append(wrapper);

    const inputGroup = document.createElement('div');
    inputGroup.classList.add('dt-input-group');
    wrapper.append(inputGroup);

    this.input = document.createElement('input');
    this.input.classList.add('dt-input');
    this.input.placeholder = this.table.messages.search;
    this.input.value = this.table.dataFilter.globalFilterValue;
    inputGroup.append(this.input);
    this.addListener({
      eventName: 'input',
      target: this.input,
      handler: this.onInputGlobalSearch.bind(this)
    });
    this.addListener({
      eventName: 'keypress',
      target: this.input,
      handler: this.onKeyPressGlobalSearch.bind(this)
    });
    this.addListener({
      eventName: 'filter',
      target: this.table.events.element,
      handler: this.onFilter.bind(this)
    });

    const button = document.createElement('button');
    button.classList.add('dt-button');
    button.textContent = this.table.messages.go;
    inputGroup.append(button);
    this.addListener({
      eventName: 'click',
      target: button,
      handler: this.onClickGlobalSearch.bind(this)
    });
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
    if (this.input) {
      this.input.value = this.table.dataFilter.globalFilterValue;
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

  private createActionClick() {
    this.dispatchEvent(new CustomEvent('createAction'));
  }

  private clearAllFilters() {
    if (this.table.dataFilter.hasFilters()) {
      this.table.dataFilter.clear();
      this.table.events.emitFilter();
    }
  }

}

customElements.define('web-dt-toolbar', DtToolbarComponent);
