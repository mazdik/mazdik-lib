import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';
import { CustomColumnGroupRenderer } from '../shared/custom-column-group-renderer';

export default class DtColumnGroupDemo implements Page {

  get template(): string {
    return `<web-data-table class="dt-column-group-demo"></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.splice(17);
    const settings = new Settings({
      columnGroupTemplate: new CustomColumnGroupRenderer()
    });
    const table = new DataTable(columns, settings);
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
