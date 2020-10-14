import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { DemoService } from '../shared/demo.service';

export default class DtVirtualScrollDemo implements Page {

  get template(): string {
    return `<p>Client-side virtual scroll with dynamic row height</p>
    <web-data-table></web-data-table>
    <p>Server-side virtual scroll</p>
    <web-crud-table></web-crud-table>`;
  }

  load() {
    this.clientSide();
    this.serverSide();
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

  private serverSide() {
    const component = document.querySelector('web-crud-table') as CrudTableComponent;
    const columns = getColumnsPlayers();
    const settings = new CdtSettings({
      virtualScroll: true,
    });
    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service);
    component.dataManager = dataManager;
  }

}
