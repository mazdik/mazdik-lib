import { Page } from '../page';
import '@mazdik-lib/crud-table';
import { CrudTableComponent, CdtSettings, DataManager } from '@mazdik-lib/crud-table';
import { ColumnBase, TemplateContext } from '@mazdik-lib/data-table';
import { DemoService } from '../shared/demo.service';
import { CellMultiSelectRenderer } from '../shared/cell-multi-select-renderer';

export default class CtMultiSelect implements Page {

  get template(): string {
    return `<div class="multi-select-demo-block">
      <web-crud-table></web-crud-table>
    </div>`;
  }

  load() {
    const component = document.querySelector('web-crud-table') as CrudTableComponent;
    const columns: ColumnBase[] = [
      { title: 'Id', name: 'id' },
      { title: 'Name', name: 'name' },
      {
        title: 'Test',
        name: 'test',
        width: 250,
        cellTemplate: new CellMultiSelectRenderer(this.onClickFunc.bind(this)),
      }
    ];
    const settings = new CdtSettings({
      crud: true,
    });
    const service = new DemoService();
    const dataManager = new DataManager(columns, settings, service);
    component.dataManager = dataManager;
  }

  private onClickFunc(context: TemplateContext, event: MouseEvent) {
    const { cell } = context;
    const row = cell.row;
    console.log(cell);
    // const { left, top } = EventHelper.getRowPosition(event, this.dataManager.settings.virtualScroll);
    // this.rowMenuBeforeOpen(row);
    // this.rowMenu.show({ originalEvent: event, data: row, left, top } as MenuEventArgs);
  }

}
