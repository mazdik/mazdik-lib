import { Page } from '../page';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { ColumnBase } from '@mazdik-lib/data-table';
import { SelectItem } from '@mazdik-lib/common';
import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { DemoService } from '../shared/demo.service';
import { CellMultiSelectRenderer } from '../shared/cell-multi-select-renderer';

export default class CtMultiSelect implements Page {

  get template(): string {
    return `<div class="multi-select-demo-block">
      <web-select-list class="dt-dropdown-select-list"></web-select-list>
      <web-crud-table class="multi-select-demo"></web-crud-table>
    </div>`;
  }

  load() {
    const options: SelectItem[] = [
      {id: '1', name: 'Select 1'},
      {id: '2', name: 'Select 2'},
      {id: '3', name: 'Select 3'},
      {id: '4', name: 'Select 4'},
    ];

    const selectList = document.querySelector('web-select-list') as SelectListComponent;
    selectList.settings = { multiple: true };
    selectList.options = options;

    const component = document.querySelector('web-crud-table') as CrudTableComponent;

    const columns: ColumnBase[] = [
      { title: 'Id', name: 'id' },
      { title: 'Name', name: 'name' },
      {
        title: 'Test',
        name: 'test',
        width: 250,
        cellTemplate: new CellMultiSelectRenderer(selectList, options),
      }
    ];
    const settings = new CdtSettings({
      crud: true,
    });
    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service);
    component.dataManager = dataManager;
  }

}
