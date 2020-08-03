import { Listener } from '@mazdik-lib/common';
import '@mazdik-lib/pagination';
import { PaginationComponent, PageEvent } from '@mazdik-lib/pagination';
import { DataTable, EventHelper } from './base';
import { BodyCell } from './body-cell';
import { BodyRow } from './body-row';
import { Filter } from './filter/filter';
import { Header } from './header';

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

  private body: HTMLElement;
  private bodyRows: BodyRow[] = [];
  private bodyCells: BodyCell[] = [];

  private footer: HTMLElement;
  private resizeHelper: HTMLElement;
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
        target: this.body,
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
    this.createBody();
    this.createFooter();

    this.header.createHeaderCells();
    this.createRows();
    this.updateStyles();

    if (this.table.settings.paginator) {
      this.pagination = document.createElement('web-pagination') as PaginationComponent;
      this.footer.append(this.pagination);
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

  private createBody() {
    this.body = document.createElement('div');
    this.body.classList.add('datatable-body');
    this.main.append(this.body);
  }

  private createRows() {
    this.bodyRows = [];
    this.body.innerHTML = '';
    this.bodyCells = [];
    this.table.rows.forEach(row => {
      const bodyRow = new BodyRow(this.table, row);
      this.bodyRows.push(bodyRow);
      this.body.append(bodyRow.element);

      this.table.preparedColumns.forEach(column => {
        const bodyCell = new BodyCell(row, column);
        this.bodyCells.push(bodyCell);
        bodyRow.element.append(bodyCell.element);
      });
    });
  }

  private createFooter() {
    this.footer = document.createElement('div');
    this.footer.classList.add('datatable-footer');
    this.append(this.footer);

    this.resizeHelper = document.createElement('div');
    this.resizeHelper.classList.add('column-resizer-helper');
    this.append(this.resizeHelper);
  }

  updateStyles() {
    this.header.element.style.width = this.table.dimensions.columnsTotalWidth + 'px';
    this.body.style.width = this.table.dimensions.columnsTotalWidth + 'px';
  }

  updateBodyStyles() {
    this.bodyRows.forEach(x => x.updateStyles());
    this.bodyCells.forEach(x => x.updateStyles());
  }

  updateAllStyles() {
    this.header.updateHeaderStyles();
    this.updateBodyStyles();
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

    this.createRows();
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
    this.createRows();
  }

  private onSort() {
    if (this.table.clientSide) {
      this.table.loadLocalRows();
    }
    this.table.selection.clearSelection();

    this.header.updateHeaderStyles();
    this.createRows();
  }

  private onSelection() {
    this.updateBodyStyles();
  }

  private onScroll() {
    this.filter.hide();
  }

  private onСlickBody(event: any) {
    const cellEventArgs = EventHelper.findCellEvent(event, this.body);
    if (cellEventArgs) {
      this.table.events.onClickCell(cellEventArgs);
      if (!this.table.settings.selectionMode) {
        this.table.selectRow(cellEventArgs.rowIndex);
      }
    }
  }

}

customElements.define('web-data-table', DataTableComponent);
