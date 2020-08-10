import { Listener } from '@mazdik-lib/common';
import { DataTable } from './base';
import '@mazdik-lib/pagination';
import { PaginationComponent, PageEvent } from '@mazdik-lib/pagination';

export class Footer {

  element: HTMLElement;
  resizeHelper: HTMLElement;
  private pagination: PaginationComponent;
  private listeners: Listener[] = [];

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-footer');

    this.resizeHelper = document.createElement('div');
    this.resizeHelper.classList.add('column-resizer-helper');

    this.addEventListeners();
  }

  destroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [];
    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  createPagination() {
    if (this.table.settings.paginator) {
      this.pagination = document.createElement('web-pagination') as PaginationComponent;
      this.element.append(this.pagination);
      this.updatePagination();
      const listener = {
        eventName: 'pageChanged',
        target: this.pagination,
        handler: this.onPageChanged.bind(this)
      };
      this.listeners.push(listener);
      listener.target.addEventListener(listener.eventName, listener.handler);
    }
  }

  updatePagination() {
    if (this.table.settings.paginator) {
      this.pagination.totalItems = this.table.pager.total;
      this.pagination.perPage = this.table.pager.perPage;
      this.pagination.currentPage = this.table.pager.current;
      this.pagination.pageSizeOptions = (this.table.settings.virtualScroll) ? [] : this.table.pager.pageSizeOptions;
    }
  }

  private onPageChanged(event: CustomEvent<PageEvent>): void {
    this.table.pager.current = event.detail.currentPage;
    this.table.pager.perPage = event.detail.perPage;
    this.table.events.onPage();
  }

}
