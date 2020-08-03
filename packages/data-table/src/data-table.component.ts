import { Listener } from '@mazdik-lib/common';
import '@mazdik-lib/pagination';
import { PaginationComponent, PageEvent } from '@mazdik-lib/pagination';
import { DataTable, EventHelper } from './base';
import { Header } from './header';
import { Body } from './body';
import { Footer } from './footer';
import { Filter } from './filter/filter';

export class DataTableComponent extends HTMLElement {

  get table(): DataTable { return this._table; }
  set table(val: DataTable) {
    this._table = val;
    this.render();
    this.addEventListeners();
  }
  private _table: DataTable;

  private main: HTMLElement;
  private header: Header;
  private body: Body;
  private footer: Footer;
  private filter: Filter;
  private pagination: PaginationComponent;
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
    this.header.destroy();
    this.filter.destroy();
  }

  private onInit() {
    this.classList.add('datatable-wrapper');
    this.main = document.createElement('div');
    this.main.classList.add('datatable');
    this.append(this.main);
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'filter',
        target: this.table.events.element,
        handler: this.onFilter.bind(this)
      },
      {
        eventName: 'sort',
        target: this.table.events.element,
        handler: this.onSort.bind(this)
      },
      {
        eventName: 'selection',
        target: this.table.events.element,
        handler: this.onSelection.bind(this)
      },
      {
        eventName: 'scroll',
        target: this.main,
        handler: this.onScroll.bind(this)
      },
      {
        eventName: 'click',
        target: this.body.element,
        handler: this.onСlickBody.bind(this)
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

  private render() {
    this.header = new Header(this.table);
    this.main.append(this.header.element);

    this.body = new Body(this.table);
    this.main.append(this.body.element);

    this.footer = new Footer(this.table);
    this.append(this.footer.element);
    this.append(this.footer.resizeHelper);

    this.header.createHeaderCells();
    this.body.createRows();
    this.updateStyles();

    if (this.table.settings.paginator) {
      this.pagination = document.createElement('web-pagination') as PaginationComponent;
      this.footer.element.append(this.pagination);
      this.pagination.totalItems = this.table.pager.total;
      this.pagination.perPage = this.table.pager.perPage;
      this.pagination.currentPage = this.table.pager.current;
      this.pagination.pageSizeOptions = (this.table.settings.virtualScroll) ? [] : this.table.pager.pageSizeOptions;
      const listener = {
        eventName: 'pageChanged',
        target: this.pagination,
        handler: this.onPageChanged.bind(this)
      };
      this.listeners.push(listener);
      listener.target.addEventListener(listener.eventName, listener.handler);
    }
    this.filter = new Filter(this.table);
    this.append(this.filter.element);
  }

  updateStyles() {
    this.header.element.style.width = this.table.dimensions.columnsTotalWidth + 'px';
    this.body.element.style.width = this.table.dimensions.columnsTotalWidth + 'px';
  }

  updateAllStyles() {
    this.header.updateHeaderStyles();
    this.body.updateBodyStyles();
  }

  private onPageChanged(event: CustomEvent<PageEvent>): void {
    this.table.pager.current = event.detail.currentPage;
    this.table.pager.perPage = event.detail.perPage;
    this.table.events.onPage();
    if (this.table.settings.virtualScroll) {
      // TODO
      // this.body.scroller.setPageOffsetY(event.detail.currentPage);
    } else {
      if (this.table.clientSide) {
        this.table.loadLocalRows();
      }
    }
    this.table.selection.clearSelection();

    this.body.createRows();
  }

  private onFilter() {
    this.table.pager.current = 1;
    if (this.table.clientSide) {
      this.table.loadLocalRows();
    }
    this.table.selection.clearSelection();

    this.pagination.totalItems = this.table.pager.total;
    this.pagination.perPage = this.table.pager.perPage;
    this.pagination.currentPage = this.table.pager.current;
    this.body.createRows();
  }

  private onSort() {
    if (this.table.clientSide) {
      this.table.loadLocalRows();
    }
    this.table.selection.clearSelection();

    this.header.updateHeaderStyles();
    this.body.createRows();
  }

  private onSelection() {
    this.body.updateBodyStyles();
  }

  private onScroll() {
    this.filter.hide();
  }

  private onСlickBody(event: any) {
    const cellEventArgs = EventHelper.findCellEvent(event, this.body.element);
    if (cellEventArgs) {
      this.table.events.onClickCell(cellEventArgs);
      if (!this.table.settings.selectionMode) {
        this.table.selectRow(cellEventArgs.rowIndex);
      }
    }
  }

}

customElements.define('web-data-table', DataTableComponent);
