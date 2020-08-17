import { downloadCSV, Keys, Listener } from '@mazdik-lib/common';
import { DataTable, Row } from '@mazdik-lib/data-table';


export class DtToolbarComponent extends HTMLElement {

  table: DataTable;
  createAction: boolean;
  globalFilter: boolean = true;
  exportAction: boolean;
  columnToggleAction: boolean;
  clearAllFiltersAction: boolean;

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

  ngOnInit() {
    //const subFilter = this.table.events.filterSource$.subscribe(() => {
      //this.cd.markForCheck();
    //});
    //this.subscriptions.push(subFilter);
  }

  private onClickGlobalSearch() {
    this.table.events.onFilter();
  }

  private onKeyPressGlobalSearch(event: KeyboardEvent) {
    if (event.which === Keys.ENTER) {
      this.table.events.onFilter();
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
      this.table.events.onFilter();
    }
  }

}

customElements.define('web-dt-toolbar', DtToolbarComponent);
