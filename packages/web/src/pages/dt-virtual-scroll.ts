import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtVirtualScrollDemo implements Page {

  get template(): string {
    return `<p>Client-side virtual scroll with dynamic row height</p>
    <web-data-table></web-data-table>`;
  }

  load() {
    this.clientSide();
  }

  private clientSide() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    const table = new DataTable(columns, new Settings({virtualScroll: true, rowHeightProp: '$$height'}));
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        for (const row of data) {
          row.$$height = (row.exp > 1000000) ? 40 : 25;
        }
        table.rows = data;
        table.events.emitLoading(false);
      });
  }

}
