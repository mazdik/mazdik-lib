import { Page } from '../page';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { getColumnsPlayers } from '../shared/columns';
import { SelectItem } from '@mazdik-lib/common';
import { DtMessagesEn } from '@mazdik-lib/data-table';
import { DemoService } from '../shared/demo.service';

export default class CrudTableDemo implements Page {

  get template(): string {
    return `<web-crud-table></web-crud-table>`;
  }

  load() {
    const component = document.querySelector('web-crud-table') as CrudTableComponent;

    const columns = getColumnsPlayers();
    columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);
    columns[4].filterValues = this.filterValuesFunc;

    const settings = new CdtSettings({
      crud: true,
      exportAction: true,
      globalFilter: true,
      columnToggleAction: true,
      clearAllFiltersAction: true,
    });

    const messages = new DtMessagesEn({
      titleDetailView: 'Player details',
      titleCreate: 'Create a new player'
    });

    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service, messages);
    component.dataManager = dataManager;
  }

  filterValuesFunc(columnName: string): Promise<SelectItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(
        [
          {id: 'MALE', name: 'MALE'},
          {id: 'FEMALE', name: 'FEMALE'},
        ]
      ), 1000);
    });
  }

}
