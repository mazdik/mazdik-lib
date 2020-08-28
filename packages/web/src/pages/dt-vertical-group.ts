import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, GroupMetadata, DataAggregation } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtVerticalGroupDemo implements Page {

  get template(): string {
    return `
    <div class="vertical-group-demo">
      <div class="datatable vertical">
        <div class="datatable-header-cell">
            <span class="column-title">Race</span>
        </div>
        <div id="dtv1" class="datatable-body"></div>
      </div>
      <div class="datatable vertical">
        <div class="datatable-header-cell">
            <span class="column-title">Gender</span>
        </div>
        <div id="dtv2" class="datatable-body"></div>
      </div>
      <web-data-table class="tab2 fixed-header"></web-data-table>
    </div>`;
  }
  private raceGroupMetadata: GroupMetadata;
  private genderGroupMetadata: GroupMetadata;
  private dtv1: HTMLElement;
  private dtv2: HTMLElement;

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;
    this.dtv1 = document.querySelector('#dtv1');
    this.dtv2 = document.querySelector('#dtv2');

    const columns = getColumnsPlayers();
    columns[2].tableHidden = true;
    columns[4].tableHidden = true;

    const table = new DataTable(columns, new Settings({filter: false, paginator: false}));
    table.pager.perPage = 50;
    component.table = table;

    const dataAggregation = new DataAggregation();

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.sorter.multiple = true;
        table.sorter.set(['race', 'gender']);
        table.rows = table.sorter.sortRows(data);
        table.sorter.set(['race', 'gender']);
        this.raceGroupMetadata = dataAggregation.groupMetaData(table.rows, ['race']);
        this.genderGroupMetadata = dataAggregation.groupMetaData(table.rows, ['race', 'gender']);
        this.render(table);
        table.events.emitLoading(false);
      });

    const datatable = document.querySelector('web-data-table .datatable') as HTMLElement;
    datatable.addEventListener('scroll', (event) => {
      const dom = event.currentTarget as Element;
      this.dtv1.scrollTop = dom.scrollTop;
      this.dtv2.scrollTop = dom.scrollTop;
    });
  }

  private render(table: DataTable) {
    this.dtv1.innerHTML = '';
    this.dtv2.innerHTML = '';

    let elements = [];
    Object.keys(this.raceGroupMetadata).forEach(key => {
      const element = document.createElement('div');
      element.classList.add('datatable-body-cell');
      element.style.height = table.dimensions.rowHeight * this.raceGroupMetadata[key].size + 'px';
      const cellData = document.createElement('div');
      cellData.classList.add('cell-data');
      cellData.textContent = key;
      element.append(cellData);

      elements.push(element);
    });
    this.dtv1.append(...elements);

    elements = [];
    Object.keys(this.genderGroupMetadata).forEach(key => {
      const element = document.createElement('div');
      element.classList.add('datatable-body-cell');
      element.style.height = table.dimensions.rowHeight * this.genderGroupMetadata[key].size + 'px';
      const cellData = document.createElement('div');
      cellData.classList.add('cell-data');
      cellData.textContent = key.split(',')[1];
      element.append(cellData);

      elements.push(element);
    });
    this.dtv2.append(...elements);
  }

}
