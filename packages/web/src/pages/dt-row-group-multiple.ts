import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtRowGroupMultipleDemo implements Page {

  get template(): string {
    return `<web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'race').tableHidden = true;
    columns.find(x => x.name === 'gender').tableHidden = true;
    const settings = new Settings({
      groupRowsBy: ['race', 'gender']
    });
    const table = new DataTable(columns, settings);
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
