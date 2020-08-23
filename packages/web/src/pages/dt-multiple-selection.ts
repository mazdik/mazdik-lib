import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, SelectionMode } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtMultipleSelectionDemo implements Page {

  get template(): string {
    return `<button class="dt-button">Clear all selections</button>
    <p>Selection type: multiple. Selection mode: checkbox</p>
    <web-data-table id="table1"></web-data-table>
    <p>Selection type: multiple. Selection mode: radio</p>
    <web-data-table id="table2"></web-data-table>`;
  }

  load() {
    const table1 = this.createTable('#table1', 'checkbox');
    const table2 = this.createTable('#table2', 'radio');

    table1.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table1.rows = data;
        table2.rows = data;
        table1.events.emitLoading(false);
      });

    const button = document.querySelector('button');
    button.addEventListener('click', () => {
      table1.selection.clearSelection();
      table2.selection.clearSelection();
    });
  }

  private createTable(id: string, selectionMode: SelectionMode): DataTable {
    const component = document.querySelector(id) as DataTableComponent;

    const columns = getColumnsPlayers();
    const settings = new Settings({
      selectionMultiple: true,
      selectionMode,
    });
    const table = new DataTable(columns, settings);
    component.table = table;
    return table;
  }

}
