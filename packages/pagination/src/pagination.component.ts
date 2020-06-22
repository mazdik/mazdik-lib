import { Listener, isBlank, toggleClass } from '@mazdik-lib/common';
import { PageEvent } from './types';
import { Pagination } from './pagination';

export class PaginationComponent extends HTMLElement {

  get perPage(): number { return this._perPage; }
  set perPage(value: number) {
    this._perPage = value;
    this.totalPages = Pagination.getTotalPages(this.totalItems, this.perPage);
    this.pages = Pagination.getPages(this.currentPage, this.totalPages);
    this.renderPages();
    this.setSelectedIndex();
  }
  private _perPage: number = 10;

  get totalItems(): number { return this._totalItems; }
  set totalItems(value: number) {
    this._totalItems = value;
    this.totalPages = Pagination.getTotalPages(this.totalItems, this.perPage);
    this.pages = Pagination.getPages(this.currentPage, this.totalPages);
    this.renderPages();
  }
  private _totalItems: number = 0;

  get currentPage(): number { return this._currentPage; }
  set currentPage(value: number) {
    this._currentPage = (value > this.totalPages) ? this.totalPages : (value || 1);
    this.pages = Pagination.getPages(this.currentPage, this.totalPages);
    this.renderPages();
  }
  private _currentPage: number = 1;

  get pageSizeOptions(): number[] { return this._pageSizeOptions; }
  set pageSizeOptions(value: number[]) {
    this._pageSizeOptions = (value || []).sort((a, b) => a - b);
    this.loadSelect();
  }
  private _pageSizeOptions: number[] = [];

  private totalPages: number;
  private pages: number[];
  private listeners: Listener[] = [];
  private select: HTMLSelectElement;
  private pageSize: HTMLElement;
  private rangeLabel: HTMLElement;
  private navigation: HTMLElement;
  private pageElements: HTMLElement[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('pagination');
    this.render();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'change',
        target: this.select,
        handler: this.onChangePageSize.bind(this)
      },
      {
        eventName: 'click',
        target: this.navigation,
        handler: this.onClick.bind(this)
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

  private setPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.emitEvent();
    }
  }

  private onChangePageSize(event: any) {
    this.perPage = parseInt(event.target.value, 10);
    this.currentPage = this._currentPage;
    this.emitEvent();
  }

  private emitEvent() {
    const event: PageEvent = { currentPage: this.currentPage, perPage: this.perPage };
    this.dispatchEvent(new CustomEvent('pageChanged', { detail: event }));
  }

  private render() {
    this.pageSize = document.createElement('div');
    this.pageSize.classList.add('pagination-page-size');

    this.select = document.createElement('select');
    this.select.classList.add('pagination-page-size-select');
    this.select.style.display = 'none';
    this.pageSize.append(this.select);

    this.rangeLabel = document.createElement('div');
    this.rangeLabel.classList.add('pagination-range-label');

    this.navigation = document.createElement('div');
    this.navigation.classList.add('pagination-navigation');

    this.append(this.pageSize);
    this.append(this.rangeLabel);
    this.append(this.navigation);
  }

  private renderPages() {
    const elements = [];
    elements.push(this.createActionLink('first', '&laquo;'));
    elements.push(this.createActionLink('prev', '&lsaquo;'));

    this.pages.forEach(page => {
      const a = document.createElement('a');
      a.dataset.id = page.toString();
      a.textContent = page.toString();
      a.href = '';
      elements.push(a);
    });

    elements.push(this.createActionLink('next', '&rsaquo;'));
    elements.push(this.createActionLink('last', '&raquo;'));

    this.navigation.innerHTML = '';
    this.navigation.append(...elements);

    this.pageElements = elements;
    this.updateStyles();
    this.setRangeLabel();
  }

  private createActionLink(action: string, label: string): HTMLAnchorElement {
    const a = document.createElement('a');
    a.dataset.action = action;
    a.innerHTML = label;
    a.href = '';
    return a;
  }

  private loadSelect() {
    this.select.style.display = 'block';
    this.select.innerHTML = '';
    this.pageSizeOptions.forEach(x => {
      const value = x.toString();
      this.select.options.add(new Option(value, value));
    });
    this.setSelectedIndex();
  }

  private setSelectedIndex() {
    if (this.pageSizeOptions && this.pageSizeOptions.length) {
      const index = this.pageSizeOptions.findIndex(x => x === this.perPage);
      this.select.selectedIndex = index;
    }
  }

  private onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const element = target.tagName === 'A' ? target : target.closest('a') as HTMLElement;
    if (!element) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    element.blur();
    if (!isBlank(element.dataset.id)) {
      const page = parseInt(element.dataset.id, 10);
      this.setPage(page);
    } else if (element.dataset.action === 'first') {
      this.setPage(1);
    } else if (element.dataset.action === 'prev') {
      this.setPage(this.currentPage - 1);
    } else if (element.dataset.action === 'next') {
      this.setPage(this.currentPage + 1);
    } else if (element.dataset.action === 'last') {
      this.setPage(this.totalPages);
    }
  }

  private updateStyles() {
    this.pageElements.forEach(element => {
      toggleClass(element, 'active', this.currentPage.toString() === element.dataset.id);
      if (element.dataset.action === 'first' || element.dataset.action === 'prev') {
        toggleClass(element, 'disabled', this.currentPage === 1);
      }
      if (element.dataset.action === 'next' || element.dataset.action === 'last') {
        toggleClass(element, 'disabled', this.currentPage === this.totalPages);
      }
    });
  }

  private setRangeLabel() {
    this.rangeLabel.textContent = Pagination.getRangeLabel(this.currentPage, this.perPage, this.totalItems);
  }

}

customElements.define('web-pagination', PaginationComponent);
