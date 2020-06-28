import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { Listener } from '@mazdik-lib/common';
import { DataTable, Column, FilterOperator } from './base';

export class ListFilter {

  element: HTMLElement;

  private column: Column;
  private loader: HTMLElement;
  private selectList: SelectListComponent;
  private listeners: Listener[] = [];

  constructor(private table: DataTable) {
    this.element = document.createElement('div');

    this.loader = document.createElement('i');
    this.loader.classList.add('dt-loader');
    this.loader.style.display = 'none';
    this.element.append(this.loader);

    this.selectList = document.createElement('web-select-list') as SelectListComponent;
    this.element.append(this.selectList);
    this.addEventListeners();
  }

  destroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'selectionChange',
        target: this.selectList,
        handler: this.onSelectionChange.bind(this)
      },
      {
        eventName: 'selectionCancel',
        target: this.selectList,
        handler: this.onSelectionCancel.bind(this)
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

  onOpenChange(column: Column, isOpen: boolean) {
    this.column = column;
    this.selectList.settings = {
      multiple: column.multiSelectFilter,
      selectAllMessage: this.table.messages.selectAll,
      cancelMessage: this.table.messages.cancel,
      clearMessage: this.table.messages.clear,
      searchMessage: this.table.messages.search,
    };
    this.selectList.isOpen = isOpen;
    if (isOpen) {
      this.load(column);
    }
  }

  private load(column: Column) {
    this.selectList.model = this.getSelectedOptions(column);
    this.setLoader(true);
    column.getFilterValues().then((res) => {
      column.filterValuesTemp = res;
      this.selectList.options = column.filterValuesTemp;
    }).finally(() => {
      this.setLoader(false);
    });
  }

  private getSelectedOptions(column: Column): any[] {
    const field = (column.keyColumn) ? column.keyColumn : column.name;
    return this.table.dataFilter.getFilterValue(field) || [];
  }

  private saveFilter(value) {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.table.dataFilter.setFilter([...value], field, FilterOperator.IN, null, this.column.dataType);
    this.table.events.onFilter();
  }

  private onSelectionChange(event: CustomEvent<string[]>) {
    this.saveFilter(event.detail);
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private onSelectionCancel() {
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private setLoader(val: boolean) {
    this.loader.style.display = val ? 'block' : 'none';
    this.selectList.style.display = !val ? 'block' : 'none';
  }

}
