import { Listener, toggleClass } from '@mazdik-lib/common';
import { DataTable, Column, EventHelper, ColumnMenuEventArgs } from './base';
import { Resizable, ResizableEvent } from '@mazdik-lib/resizable';

export class HeaderCell {

  element: HTMLElement;
  private header: HTMLElement;
  private iconSort: HTMLElement;
  private iconFilter: HTMLElement;
  private listeners: Listener[] = [];
  private resizable: Resizable;

  constructor(private table: DataTable, private column: Column) {
    this.createCellElements();
    this.addEventListeners();
    this.updateStyles();

    this.resizable = new Resizable(this.element, false, this.column.resizeable, false, true);
    this.resizable.addEventListeners();
  }

  destroy() {
    this.removeEventListeners();
    this.resizable.destroy();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.header,
        handler: this.onSort.bind(this)
      },
      {
        eventName: 'click',
        target: this.iconFilter,
        handler: this.onClickColumnMenu.bind(this)
      },
      {
        eventName: 'resizeBegin',
        target: this.element,
        handler: this.onResizeBegin.bind(this)
      },
      {
        eventName: 'resizing',
        target: this.element,
        handler: this.onResize.bind(this)
      },
      {
        eventName: 'resizeEnd',
        target: this.element,
        handler: this.onResizeEnd.bind(this)
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

  private createCellElements() {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-header-cell');
    this.element.style.minWidth = this.column.minWidth + 'px';
    this.element.style.maxWidth = this.column.maxWidth + 'px';
    if (this.column.frozen) {
      this.element.classList.add('dt-sticky');
    }
    this.element.title = this.column.title;
    this.element.setAttribute('role', 'columnheader');

    this.header = document.createElement('span');
    this.header.classList.add('dt-sort-header');
    this.header.textContent = this.column.title;
    this.element.append(this.header);

    this.iconSort = document.createElement('i');
    if (this.column.sortable) {
      this.header.append(this.iconSort);
    }

    this.iconFilter = document.createElement('i');
    this.iconFilter.classList.add('dt-icon-filter','column-menu-icon');
    if (this.column.filter) {
      this.element.append(this.iconFilter);
    }
  }

  private onSort() {
    if (this.column.sortable) {
      this.table.sorter.setOrder(this.column.name);
      this.table.events.emitSort();
    }
  }

  private onClickColumnMenu(event: MouseEvent) {
    const {left, top} = EventHelper.getColumnPosition(event, this.table.dimensions.columnMenuWidth);
    this.table.events.emitColumnMenuClick({left, top, column: this.column} as ColumnMenuEventArgs);
  }

  updateStyles() {
    this.element.style.width = this.column.width + 'px';
    if (this.column.frozen) {
      this.element.style.left = this.column.left + 'px';
    }
    this.iconSort.className = 'dt-icon ' + this.getDirection();
    toggleClass(this.iconFilter, 'is-filter', this.isFiltered());
    if (this.column.headerCellClass) {
      this.element.classList.add(this.column.headerCellClass);
    }
  }

  private getDirection() {
    const order = this.table.sorter.getOrder(this.column.name);
    return (order === -1) ? 'desc' : (order === 1) ? 'asc' : '';
  }

  private isFiltered(): boolean {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    return this.table.dataFilter.hasFilter(field);
  }

  private onResizeBegin() {
    this.table.events.emitResizeBegin();
  }

  private onResize(event: CustomEvent<ResizableEvent>) {
    this.table.events.emitResize(event.detail.event);
  }

  private onResizeEnd(event: CustomEvent<ResizableEvent>) {
    this.column.setWidth(event.detail.width);
    this.table.events.emitResizeEnd();
  }

}
