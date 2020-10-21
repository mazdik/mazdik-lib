import { Page } from '../page';
import { getColumnsPlayers } from '../shared/columns';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { DemoService } from '../shared/demo.service';

export default class CtVirtualScrollDemo implements Page {

  get template(): string {
    return `<web-crud-table></web-crud-table>`;
  }

  load() {
    this.serverSide();
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
