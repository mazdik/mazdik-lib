import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtCssDemo implements Page {

  get template(): string {
    return `<web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns[5].cellClass = this.getCellClass;
    columns[2].headerCellClass = 'header-cell-demo';
    const settings = new Settings({
      rowClass: this.getRowClass,
    });
    const table = new DataTable(columns, settings);
    table.pager.perPage = 20;
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.emitLoading(false);
      });
  }

  getCellClass({row, column, value}): any {
    return {
      'cell-big-value': parseInt(value, 10) > 1000000000,
      'cell-middle-value': parseInt(value, 10) > 1000000 && parseInt(value, 10) < 1000000000,
      'cell-zero-value': parseInt(value, 10) === 0,
      'cell-right': true,
    };
  }

  getRowClass(row): any {
    return {
      'row-warrior': (row['player_class'] === 'WARRIOR'),
      'row-sorcerer': (row['player_class'] === 'SORCERER')
    };
  }

}
