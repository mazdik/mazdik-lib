import { Page } from '../page';
import { getColumnsPlayers } from '../shared/columns';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { DemoService } from '../shared/demo.service';

export default class DtGlobalFilterDemo implements Page {

  get template(): string {
    return `<p>Server-side global filter</p>
    <web-crud-table></web-crud-table>`;
  }

  load() {
    this.serverSide();
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
