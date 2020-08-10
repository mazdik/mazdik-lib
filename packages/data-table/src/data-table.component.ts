import { Listener } from '@mazdik-lib/common';
import { VirtualScroller } from '@mazdik-lib/scroller';
import { DataTable, Row } from './base';
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
  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private virtualScroller: VirtualScroller;

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
    this.body.destroy();
    this.footer.destroy();
    this.filter.destroy();
    if (this.table.settings.virtualScroll) {
      this.virtualScroller.destroy();
    }
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
        eventName: 'page',
        target: this.table.events.element,
        handler: this.onPage.bind(this)
      },
      {
        eventName: 'resizeBegin',
        target: this.table.events.element,
        handler: this.onColumnResizeBegin.bind(this)
      },
      {
        eventName: 'resize',
        target: this.table.events.element,
        handler: this.onColumnResize.bind(this)
      },
      {
        eventName: 'resizeEnd',
        target: this.table.events.element,
        handler: this.onColumnResizeEnd.bind(this)
      },
      {
        eventName: 'rowsChanged',
        target: this.table.events.element,
        handler: this.onRowsChanged.bind(this)
      },
      {
        eventName: 'scroll',
        target: this.main,
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

  private render() {
    this.header = new Header(this.table);
    this.main.append(this.header.element);

    this.body = new Body(this.table);
    this.main.append(this.body.element);

    this.footer = new Footer(this.table);
    this.append(this.footer.element);
    this.append(this.footer.resizeHelper);
    this.footer.createPagination(); // after append

    this.header.createHeaderCells();
    this.updateStyles();

    this.filter = new Filter(this.table);
    this.append(this.filter.element);

    if (this.table.settings.virtualScroll) {
      this.virtualScroller = new VirtualScroller(this.main, this.body.element, this.table.dimensions.rowHeight, this.table.pager.perPage);
      const listener = {
        eventName: 'viewRowsChange',
        target: this.main,
        handler: this.onViewRowsChange.bind(this)
      };
      this.listeners.push(listener);
      listener.target.addEventListener(listener.eventName, listener.handler);
    }
  }

  updateStyles() {
    this.header.element.style.width = this.table.dimensions.columnsTotalWidth + 'px';
    this.body.element.style.width = this.table.dimensions.columnsTotalWidth + 'px';
  }

  updateAllStyles() {
    this.header.updateHeaderStyles();
    this.body.updateBodyStyles();
    this.updateStyles();
  }

  private onPage(): void {
    if (this.table.settings.virtualScroll) {
      this.virtualScroller.setPageOffsetY(this.table.pager.current);
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
    if (this.table.settings.virtualScroll) {
      this.virtualScroller.items = this.table.rows;
    }
    this.table.selection.clearSelection();
    this.body.createRows();
    this.footer.updatePagination();
  }

  private onSort() {
    if (this.table.clientSide) {
      this.table.loadLocalRows();
    }
    if (this.table.settings.virtualScroll) {
      this.virtualScroller.items = this.table.rows;
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

  private onColumnResizeBegin() {
    this.main.classList.add('datatable-unselectable');
    const height = this.main.offsetHeight;
    this.footer.resizeHelper.style.height = height + 'px';
  }

  private onColumnResize(event: CustomEvent) {
    const rect = this.getBoundingClientRect();
    const containerLeft = rect.left + document.body.scrollLeft;
    this.footer.resizeHelper.style.left = (event.detail.pageX - containerLeft + this.scrollLeft) + 'px';
    this.footer.resizeHelper.style.display = 'block';
  }

  private onColumnResizeEnd() {
    this.footer.resizeHelper.style.display = 'none';
    this.main.classList.remove('datatable-unselectable');
    this.table.dimensions.recalcColumns();
    this.updateAllStyles();
  }

  private onViewRowsChange(event: CustomEvent<Row[]>) {
    this.body.viewRows = event.detail;
    this.table.pager.current = this.virtualScroller.calcPage();
    this.body.createRows();
    this.footer.updatePagination();
  }

  private onRowsChanged() {
    if (this.table.settings.virtualScroll) {
      this.virtualScroller.items = this.table.rows;
    }
    this.body.createRows();
    this.footer.updatePagination();
  }

}

customElements.define('web-data-table', DataTableComponent);
