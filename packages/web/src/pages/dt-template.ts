import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, TemplateRenderer, TemplateContext, ColumnBase } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export class CellTemplateRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];

  create(context: TemplateContext): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('cell-data');
    element.textContent = context.cell.viewValue;

    this.elements.push(element);
    return element;
  }

  destroy() {
    this.elements.forEach(x => x.remove());
    this.elements = [];
  }

}

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
