import { FilterMetadata } from '@mazdik-lib/data-table';
import { Row } from '@mazdik-lib/data-table';
import { DataTable } from '@mazdik-lib/data-table';
import { ColumnBase } from '@mazdik-lib/data-table';
import { ColumnModelGenerator } from '@mazdik-lib/data-table';
import { DtMessages } from '@mazdik-lib/data-table';
import { DataSource, RequestMetadata } from './types';
import { CdtSettings } from './cdt-settings';

export class DataManager extends DataTable {

  readonly settings: CdtSettings;
  readonly service: DataSource;
  item: any;
  refreshRowOnSave: boolean;
  pagerCache: any = {};

  constructor(columns: ColumnBase[], settings: CdtSettings, dataSource: DataSource, messages?: DtMessages) {
    super(((x) => { columns.unshift(x); return columns; })(ColumnModelGenerator.actionColumn), settings, messages);
    this.settings = new CdtSettings(settings);
    //this.settings.paginator = !this.settings.virtualScroll;
    this.clientSide = false;
    this.service = dataSource;

    this.columns.forEach(col => {
      if (col.filterValues && typeof col.filterValues === 'string') {
        col.filterValues = this.service.getOptions.bind(this.service, col.filterValues);
      }
    });
  }

  get filters(): FilterMetadata { return this.dataFilter.filters; }
  set filters(val: FilterMetadata) {
    this.dataFilter.filters = val;
    this.events.emitFilter();
  }

  loadItems() {
    return this.getItems(this.settings.virtualScroll, this.pager.current);
  }

  loadNextPage() {
    let totalPages = this.pager.perPage < 1 ? 1 : Math.ceil(this.pager.total / this.pager.perPage);
    totalPages = Math.max(totalPages || 0, 1);
    const page = Math.min(this.pager.current + 1, totalPages);
    return this.getItems(this.settings.virtualScroll, page);
  }

  getItems(concatRows: boolean = false, page: number): Promise<any> {
    if (concatRows === true && this.pagerCache[page]) {
      return Promise.resolve();
    }
    this.events.emitLoading(true);
    this.setSortMetaGroup();
    const requestMeta: RequestMetadata = {
      pageMeta: { currentPage: page, perPage: this.pager.perPage },
      filters: this.dataFilter.filters,
      sortMeta: this.sorter.sortMeta,
      globalFilterValue: this.dataFilter.globalFilterValue,
    };

    return this.service
      .getItems(requestMeta)
      .then(data => {
        const rows = (concatRows) ? this.rows.concat(data.items) : data.items;
        if (concatRows) {
          this.pager.total = (data._meta.totalCount > rows.length) ? rows.length + 1 : rows.length;
        } else {
          this.pager.total = data._meta.totalCount;
        }
        this.pager.perPage = data._meta.perPage;
        this.pagerCache[page] = true;
        this.rows = rows;
      })
      .finally(() => { this.events.emitLoading(false); });
  }

  create(row: Row) {
    this.events.emitLoading(true);
    this.service
      .post(row)
      .then(res => {
        if (this.refreshRowOnSave) {
          this.loadItems();
        } else {
          this.addRow(res || row);
        }
      })
      .finally(() => { this.events.emitLoading(false); });
  }

  update(row: Row) {
    this.events.emitLoading(true);
    this.service.put(row)
      .then(res => {
        this.afterUpdate(row, res);
      })
      .finally(() => { this.events.emitLoading(false); });
  }

  delete(row: Row) {
    this.events.emitLoading(true);
    this.service
      .delete(row)
      .then(res => {
        this.deleteRow(row);
      })
      .finally(() => { this.events.emitLoading(false); });
  }

  afterUpdate(row: Row, result: any) {
    if (this.refreshRowOnSave) {
      this.refreshRow(row);
    } else {
      this.mergeRow(row, result || row);
    }
  }

  refreshRow(row: Row) {
    this.events.emitLoading(true);
    this.service.getItem(row)
      .then(data => {
        this.mergeRow(row, data);
      })
      .finally(() => { this.events.emitLoading(false); });
  }

  clear() {
    this.rows = [];
    this.pager.total = 0;
  }

  rowIsValid(row: Row) {
    const hasError = this.columns.some(x => {
      const errors = x.validate(row[x.name]);
      return (errors && errors.length > 0);
    });
    return !hasError;
  }

}
