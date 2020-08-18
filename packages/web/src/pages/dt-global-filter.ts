import { Page } from '../page';
import '@mazdik-lib/data-table';
import '@mazdik-lib/dt-toolbar';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { DtToolbarComponent } from '@mazdik-lib/dt-toolbar';
import { getColumnsPlayers } from '../shared/columns';

export default class DtGlobalFilterDemo implements Page {

  get template(): string {
    return `<p>Client-side global filter</p>
    <web-dt-toolbar></web-dt-toolbar>
    <web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    const table = new DataTable(columns, new Settings());
    component.table = table;

    table.events.onLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.onLoading(false);
      });

      const toolbarComponent = document.querySelector('web-dt-toolbar') as DtToolbarComponent;
      toolbarComponent.table = table;
      toolbarComponent.globalFilter = true;
  }

}
