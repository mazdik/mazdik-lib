import { Listener, toggleClass } from '@mazdik-lib/common';
import { KeyValuePair } from './types';

export class RowViewComponent extends HTMLElement {

  get data(): KeyValuePair[] { return this._data; }
  set data(val: KeyValuePair[]) {
    this._data = val;
    this.renderRows();
  }
  private _data: KeyValuePair[];

  headerKeyMessage: string = 'Key';
  headerValueMessage: string = 'Value';

  private order: string;
  private reverse: boolean = true;
  private orderedData: KeyValuePair[];
  private listeners: Listener[] = [];
  private isInitialized: boolean;

  private headerKey: HTMLElement;
  private headerValue: HTMLElement;
  private tbody: HTMLElement;

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
    this.renderTable();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.headerKey,
        handler: this.onClickHeaderKey.bind(this)
      },
      {
        eventName: 'click',
        target: this.headerValue,
        handler: this.onClickHeaderValue.bind(this)
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

  private renderTable() {
    const table = document.createElement('table');
    table.classList.add('dt-detail-view');

    const thead = document.createElement('thead');
    table.append(thead);

    const tr = document.createElement('tr');
    thead.append(tr);

    const th = document.createElement('th');
    th.textContent = '№';
    tr.append(th);

    this.headerKey = document.createElement('th');
    this.headerKey.classList.add('sortable');
    this.headerKey.textContent = this.headerKeyMessage;
    tr.append(this.headerKey);

    this.headerValue = document.createElement('th');
    this.headerValue.classList.add('sortable');
    this.headerValue.textContent = this.headerValueMessage;
    tr.append(this.headerValue);

    this.tbody = document.createElement('tbody');
    table.append(this.tbody);

    this.append(table);
  }

  private renderRows() {
    const viewData = (this.orderedData) ? this.orderedData : this.data;
    const elements = [];
    viewData.forEach((x, i) => {
      const tr = document.createElement('tr');

      const td = document.createElement('td');
      td.textContent = (i + 1).toString();
      tr.append(td);

      const tdKey = document.createElement('td');
      tdKey.textContent = x.key;
      tr.append(tdKey);

      const tdValue = document.createElement('td');
      tdValue.textContent = x.value;
      tr.append(tdValue);

      elements.push(tr);
    });
    this.tbody.innerHTML = '';
    this.tbody.append(...elements);
  }

  private onClickHeaderKey() {
    this.setOrder('key');
    this.renderRows();
    this.updateStyles();
  }

  private onClickHeaderValue() {
    this.setOrder('value');
    this.renderRows();
    this.updateStyles();
  }

  private setOrder(name: string) {
    if (this.order === name) {
      this.reverse = !this.reverse;
    }
    this.order = name;
    this.orderedData = this.orderBy(this.data, this.order, this.reverse);
  }

  private orderBy(array: any[], field: string, reverse?: boolean): any[] {
    if (!array || !field) {
      return array;
    }
    array.sort((a, b) => (a[field] > b[field]) ? 1 : (a[field] < b[field]) ? -1 : 0);
    return (reverse === false) ? array.reverse() : array;
  }

  private isOrder(name: string) {
    return this.order === name && this.reverse;
  }

  private isOrderReverse(name: string) {
    return this.order === name && !this.reverse;
  }

  private updateStyles() {
    toggleClass(this.headerKey, 'asc', this.isOrder('key'));
    toggleClass(this.headerKey, 'desc', this.isOrderReverse('key'));
    toggleClass(this.headerValue, 'asc', this.isOrder('value'));
    toggleClass(this.headerValue, 'desc', this.isOrderReverse('value'));
  }

}

customElements.define('web-row-view', RowViewComponent);
