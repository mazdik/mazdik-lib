import { Listener } from '@mazdik-lib/common';
import { DataManager } from './base/data-manager';
import '@mazdik-lib/data-table';
import { DataTableComponent } from '@mazdik-lib/data-table';

export class CrudTableComponent extends HTMLElement {

  get dataManager(): DataManager { return this._dataManager; }
  set dataManager(val: DataManager) {
    this._dataManager = val;
    this.initLoad();
    this.render();
    this.addEventListeners();
  }
  private _dataManager: DataManager;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private dtComponent: DataTableComponent;

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
    this.dtComponent = document.createElement('web-data-table') as DataTableComponent;
    this.append(this.dtComponent);
  }

  private addEventListeners() {
    this.listeners = [
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
    this.dtComponent.table = this.dataManager;
    if (this.dataManager.settings.initLoad) {
      this.dataManager.loadItems();
    }
  }

  private render() {

  }

}

customElements.define('web-crud-table', CrudTableComponent);
