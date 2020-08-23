import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtSummaryRowDemo implements Page {

  get template(): string {
    return `<web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.splice(17);

    columns[1].title += ' (count)';
    columns[5].title += ' (sum)';
    columns[14].title += ' (min)';
    columns[15].title += ' (max)';
    columns[16].title += ' (average)';

    columns[1].aggregation = 'count';
    columns[5].aggregation = 'sum';
    columns[14].aggregation = 'min';
    columns[15].aggregation = 'max';
    columns[16].aggregation = 'average';

    columns.splice(6, 8);

    const table = new DataTable(columns, new Settings());
    table.pager.perPage = 50;
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.emitLoading(false);
      });
  }

}
