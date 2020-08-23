import { Listener } from '@mazdik-lib/common';
import { DataManager } from './base/data-manager';

export class CrudTableComponent extends HTMLElement {

  get dataManager(): DataManager { return this._dataManager; }
  set dataManager(val: DataManager) {
    this._dataManager = val;
    this.render();
    this.addEventListeners();
  }
  private _dataManager: DataManager;

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
    this.classList.add('datatable-wrapper');
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

  private render() {

  }

}

customElements.define('web-crud-table', CrudTableComponent);
