import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, ColumnBase } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';
import { HeaderCellTemplateRenderer } from '../shared/header-cell-template-renderer';
import { CellTemplateRenderer } from '../shared/cell-template-renderer';
import { HeaderRnCellTemplateRenderer } from '../shared/header-rn-cell-template-renderer';
import { RnCellTemplateRenderer } from '../shared/rn-cell-template-renderer';

export default class DtTemplateDemo implements Page {

  get template(): string {
    return `<web-data-table></web-data-table>`;
  }

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.forEach(x => x.frozen = false);
    const rnColumn: ColumnBase = {
      name: 'rn',
      title: '#',
      sortable: false,
      filter: false,
      frozen: true,
      resizeable: false,
      width: 40,
      minWidth: 40,
      formHidden: true,
      cellClass: 'action-cell',
      headerCellClass: 'action-cell',
    };
    columns.unshift(rnColumn);

    let column = columns.find(x => x.name === 'race');
    column.headerCellTemplate = new HeaderCellTemplateRenderer();
    column.cellTemplate = new CellTemplateRenderer();

    column = columns.find(x => x.name === 'rn');
    column.headerCellTemplate = new HeaderRnCellTemplateRenderer();
    column.cellTemplate = new RnCellTemplateRenderer();

    const settings = new Settings({
      rowHeight: 40,
    });
    const table = new DataTable(columns, settings);
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.emitLoading(false);
      });
  }

}
