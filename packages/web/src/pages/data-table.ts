import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DataTableDemo implements Page {

  get template(): string {
    return `<web-data-table class="data-table-demo"></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);
    const table = new DataTable(columns, new Settings({}));
    component.table = table;

    table.events.onLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.onLoading(false);
      });
  }

}
