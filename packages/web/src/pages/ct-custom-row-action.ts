import { Page } from '../page';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { getColumnsPlayers } from '../shared/columns';
import { DemoService } from '../shared/demo.service';

export default class CtCustomRowAction implements Page {

  get template(): string {
    return `<web-crud-table></web-crud-table>`;
  }

  load() {
    const component = document.querySelector('web-crud-table') as CrudTableComponent;
    const columns = getColumnsPlayers();
    const settings = new CdtSettings({
      crud: true,
    });
    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service);
    component.dataManager = dataManager;

    this.customize(component);
  }

  private customize(cdt: CrudTableComponent) {
    const menuIndex = cdt.actionMenu.findIndex(x => x.id === cdt.dataManager.messages.delete);
    const oldBeforeOpen = cdt.rowMenuBeforeOpen;
    // disable menu based on data
    cdt.rowMenuBeforeOpen = (row) => {
      cdt.actionMenu[menuIndex].disabled = (row['race'] !== 'ASMODIANS');
      oldBeforeOpen.bind(cdt, row)(); // extend a function
    };
    // custom delete action
    cdt.actionMenu[menuIndex].command = (row) => {
      if (row['race'] === 'ASMODIANS') {
        return confirm('Delete row ?') ? cdt.dataManager.delete(row) : null;
      }
    };
    cdt.actionMenu[menuIndex].label = 'custom delete action';
    // add new menu
    cdt.actionMenu.push({
      id: 'test',
      label: 'new menu',
      command: (row) => alert(row['race']),
    });
  }

}
