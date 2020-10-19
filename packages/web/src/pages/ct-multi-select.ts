import { Page } from '../page';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { ColumnBase, PipeTransform } from '@mazdik-lib/data-table';
import { SelectItem } from '@mazdik-lib/common';
import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { DemoService } from '../shared/demo.service';
import { CellMultiSelectRenderer } from '../shared/cell-multi-select-renderer';

export class ArrayToStringPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return value;
    console.log(value)
    return value.join();
  }
}

export default class CtMultiSelect implements Page {

  get template(): string {
    return `<div class="multi-select-demo-block">
      <web-select-list class="dt-dropdown-select-list"></web-select-list>
      <web-crud-table class="multi-select-demo"></web-crud-table>
    </div>`;
  }

  private cellMultiSelectRenderer: CellMultiSelectRenderer;

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
    this.cellMultiSelectRenderer = new CellMultiSelectRenderer(selectList, options, 1);
    const columns: ColumnBase[] = [
      {
        title: 'Test',
        name: 'test',
        width: 250,
        type: 'select-dropdown',
        multiple: true,
        options,
        cellTemplate: this.cellMultiSelectRenderer,
        pipe: new ArrayToStringPipe()
      },
      { title: 'Id', name: 'id' },
      { title: 'Name', name: 'name' },
      { title: 'Race', name: 'race' },
    ];
    const settings = new CdtSettings({
      crud: true,
    });
    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service);
    component.dataManager = dataManager;
  }

  onDestroy() {
    this.cellMultiSelectRenderer.removeGlobalEventListeners();
  }

}
