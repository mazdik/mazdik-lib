import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';
import { DateFormatPipe } from '../shared/date-format-pipe';

export default class DtPipeDemo implements Page {

  get template(): string {
    return `<p>Date format pipe on column "Last online"</p><web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'last_online').pipe = new DateFormatPipe();
    const table = new DataTable(columns, new Settings());
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
