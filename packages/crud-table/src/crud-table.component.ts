import { Listener } from '@mazdik-lib/common';
import { DataManager } from './base/data-manager';
import '@mazdik-lib/data-table';
import '@mazdik-lib/dt-toolbar';
import { DataTableComponent, HeaderActionRenderer, ColumnModelGenerator } from '@mazdik-lib/data-table';
import { DtToolbarComponent } from '@mazdik-lib/dt-toolbar';
import { CellActionRenderer } from './cell-action-renderer';

export class CrudTableComponent extends HTMLElement {

  get dataManager(): DataManager { return this._dataManager; }
  set dataManager(val: DataManager) {
    this._dataManager = val;
    this.initLoad();
    this.addEventListeners();
  }
  private _dataManager: DataManager;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private dtComponent: DataTableComponent;
  private toolbarComponent: DtToolbarComponent;

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
    this.classList.add('datatable-wrapper');
    this.toolbarComponent = document.createElement('web-dt-toolbar') as DtToolbarComponent;
    this.append(this.toolbarComponent);
    this.dtComponent = document.createElement('web-data-table') as DataTableComponent;
    this.append(this.dtComponent);
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'filter',
        target: this.dataManager.events.element,
        handler: this.onFilter.bind(this)
      },
      {
        eventName: 'sort',
        target: this.dataManager.events.element,
        handler: this.onSort.bind(this)
      },
      {
        eventName: 'page',
        target: this.dataManager.events.element,
        handler: this.onPage.bind(this)
      },
      {
        eventName: 'scroll',
        target: this.dataManager.events.element,
        handler: this.onScroll.bind(this)
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

  private initLoad() {
    const actionColumn = this.dataManager.columns.find(x => x.name === ColumnModelGenerator.actionColumn.name);
    if (actionColumn) {
      actionColumn.cellTemplate = new CellActionRenderer();
      actionColumn.headerCellTemplate = new HeaderActionRenderer();
    }
    this.dtComponent.table = this.dataManager;
    //this.initRowMenu();
    if (this.dataManager.settings.initLoad) {
      this.dataManager.loadItems();
    }
    this.toolbarComponent.table = this.dataManager;
    this.toolbarComponent.globalFilter = this.dataManager.settings.globalFilter;
  }

  private onFilter() {
    this.dataManager.pager.current = 1;
    if (this.dataManager.settings.virtualScroll) {
      this.dtComponent.setOffsetY(0);
      this.dataManager.pagerCache = {};
      this.dataManager.clear();
    }
    this.dataManager.loadItems();
  }

  private onSort() {
    if (this.dataManager.settings.virtualScroll) {
      this.dtComponent.setOffsetY(0);
      this.dataManager.pager.current = 1;
      this.dataManager.pagerCache = {};
      this.dataManager.clear();
    }
    this.dataManager.loadItems();
  }

  private onPage() {
    this.dataManager.loadItems();
  }

  private onScroll() {
    //this.rowMenu.hide();
  }

}

customElements.define('web-crud-table', CrudTableComponent);
