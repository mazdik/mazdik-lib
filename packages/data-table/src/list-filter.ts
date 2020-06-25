import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { DataTable, Column, FilterOperator } from './base';

export class ListFilter {

  column: Column;
  isOpen: boolean;
  element: HTMLElement;

  private selectedOptions: any[] = [];
  private loader: HTMLElement;
  private selectList: SelectListComponent;

  constructor(private table: DataTable) {
    this.element = document.createElement('div');

    this.loader = document.createElement('i');
    this.loader.classList.add('dt-loader');
    this.loader.style.display = 'none';
    this.element.append(this.loader);

    this.selectList = document.createElement('web-select-list') as SelectListComponent;
    this.element.append(this.selectList);
  }

  destroy() {

  }

  private onChanges() {
    if (this.isOpen) {
      this.loadFilter();
      this.setLoader(true);
      this.column.getFilterValues().then((res) => {
        this.column.filterValuesTemp = res;
      }).finally(() => {
        this.setLoader(false);
        // this.cd.markForCheck(); TODO
      });
    }
  }

  private saveFilter(value) {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.table.dataFilter.setFilter([...value], field, FilterOperator.IN, null, this.column.dataType);
    this.table.events.onFilter();
  }

  private loadFilter() {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    this.selectedOptions = this.table.dataFilter.getFilterValue(field) || [];
  }

  private onSelectionChange(event) {
    this.saveFilter(event);
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private onSelectionCancel() {
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private setLoader(val: boolean) {
    this.loader.style.display = val ? 'block' : 'none';
  }

}
