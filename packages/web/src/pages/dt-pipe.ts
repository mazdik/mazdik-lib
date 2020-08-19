import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, PipeTransform } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export class DateFormatPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return value;
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(value).toLocaleTimeString([], options);
  }
}

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
