import { Page } from '../page';
import '@mazdik-lib/data-table';
import '@mazdik-lib/dt-toolbar';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { DtToolbarComponent } from '@mazdik-lib/dt-toolbar';
import { getColumnsPlayers } from '../shared/columns';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { DemoService } from '../shared/demo.service';

export default class DtGlobalFilterDemo implements Page {

  get template(): string {
    return `<p>Client-side global filter</p>
    <web-dt-toolbar></web-dt-toolbar>
    <web-data-table></web-data-table>
    <p>Server-side global filter</p>
    <web-crud-table></web-crud-table>`;
  }

  load() {
    this.clientSide();
    this.serverSide();
  }

  private clientSide() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    const table = new DataTable(columns, new Settings());
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.emitLoading(false);
      });

      const toolbarComponent = document.querySelector('web-dt-toolbar') as DtToolbarComponent;
      toolbarComponent.table = table;
      toolbarComponent.globalFilter = true;
  }

  private serverSide() {
    const component = document.querySelector('web-crud-table') as CrudTableComponent;
    const columns = getColumnsPlayers();
    const settings = new CdtSettings({
      globalFilter: true,
    });
    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service);
    component.dataManager = dataManager;
  }

}
