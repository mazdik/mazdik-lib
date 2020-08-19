import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtEditableConditionDemo implements Page {

  get template(): string {
    return `<p>Editable condition per row. If row.exp > 1000000 and column editable</p>
    <web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);

    const settings = new Settings({
      isEditableCellProp: '$$editable',
    });
    const table = new DataTable(columns, settings);
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        for (const row of data) {
          row.$$editable = row.exp > 1000000;
        }
        table.rows = data;
        table.events.emitLoading(false);
      });
  }

}
