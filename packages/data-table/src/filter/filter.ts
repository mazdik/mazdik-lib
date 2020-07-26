import { Listener } from '@mazdik-lib/common';
import { DropDown } from '@mazdik-lib/dropdown';
import { DataTable, Column, ColumnMenuEventArgs } from '../base';
import { ListFilter } from './list-filter';
import { RangeFilter } from './range-filter';

export class Filter {

  element: HTMLElement;
  private listeners: Listener[] = [];
  private dropdown: DropDown;
  private left: number;
  private top: number;
  private column: Column = new Column({});
  private listFilter: ListFilter;
  private rangeFilter: RangeFilter;

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('dropdown-filter-menu');
    this.dropdown = new DropDown(this.element);

    this.listFilter = new ListFilter(this.table);
    this.element.append(this.listFilter.element);

    this.rangeFilter = new RangeFilter(this.table);
    this.element.append(this.rangeFilter.element);

    this.updateStyles();
    this.addEventListeners();
  }

  destroy() {
    this.removeEventListeners();
    this.dropdown.removeEventListeners();
    this.listFilter.destroy();
    this.rangeFilter.destroy();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'columnMenu',
        target: this.table.events.element,
        handler: this.onColumnMenu.bind(this)
      },
      {
        eventName: 'open',
        target: this.element,
        handler: this.updateStyles.bind(this)
      },
      {
        eventName: 'filterClose',
        target: this.listFilter.element,
        handler: this.onFilterClose.bind(this)
      },
      {
        eventName: 'filterClose',
        target: this.rangeFilter.element,
        handler: this.onFilterClose.bind(this)
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

  updateStyles() {
    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
    this.element.style.width = this.table.dimensions.columnMenuWidth + 'px';
    this.element.style.display = (this.dropdown.isOpen && this.column.filter) ? 'block' : 'none';
    this.listFilter.element.style.display = this.isListFilter ? 'block' : 'none';
    this.rangeFilter.element.style.display = this.isRangeFilter ? 'block' : 'none';
  }

  private onColumnMenu(event: CustomEvent<ColumnMenuEventArgs>) {
    this.show(event.detail);
  }

  show(event: ColumnMenuEventArgs) {
    this.column = event.column;
    this.dropdown.selectContainerClicked = true;
    if (this.top === event.top && this.left === event.left) {
      this.dropdown.toggleDropdown();
    } else {
      this.top = event.top;
      this.left = event.left;
      this.dropdown.closeDropdown();
      this.dropdown.openDropdown();
    }
    if (this.isListFilter) {
      this.listFilter.onOpenChange(this.column, this.dropdown.isOpen);
    } else if (this.rangeFilter) {
      this.rangeFilter.onOpenChange(this.column);
    }
    this.updateStyles();
  }

  hide() {
    this.dropdown.closeDropdown();
    this.updateStyles();
  }

  onFilterClose() {
    this.dropdown.toggleDropdown();
    this.updateStyles();
  }

  get isListFilter(): boolean {
    return (this.column.options || this.column.filterValues) ? true : false;
  }

  get isRangeFilter(): boolean {
    return (!this.isListFilter && (this.column.type === 'number' || this.column.isDateType)) ? true : false;
  }

  get isStringFilter(): boolean {
    return (!this.isListFilter && !this.isRangeFilter) ? true : false;
  }

}
