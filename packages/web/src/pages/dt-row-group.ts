import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtRowGroupDemo implements Page {

  get template(): string {
    return `<web-data-table></web-data-table>`;
  }

  private table: DataTable;
  private component: DataTableComponent;

  load() {
    this.component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'race').tableHidden = true;
    const settings = new Settings({
      groupRowsBy: ['race'],
      rowHeightProp: '$$height',
    });
    const table = new DataTable(columns, settings);
    table.pager.perPage = 50;
    table.rowGroupTemplateFunc = this.rowGroupTemplateRenderer.bind(this);
    this.component.table = table;

    table.events.onLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(x => x.expanded = true);
        table.rows = data;
        table.events.onLoading(false);
      });

    this.table = table;
  }

  private rowGroupTemplateRenderer(row) {
    const cellEl = document.createElement('div');
    cellEl.classList.add('datatable-body-cell', 'dt-sticky', 'pointer');
    cellEl.style.left = '0';

    const iconElement = document.createElement('i');
    iconElement.className = (!row.expanded) ? 'dt-icon-node dt-icon-collapsed' : 'dt-icon-node';
    cellEl.append(iconElement);

    const text = this.table.rowGroup.getRowGroupName(row) + ' (' + this.table.rowGroup.getRowGroupSize(row) + ')';
    const textElement = document.createTextNode(text);
    cellEl.append(textElement);

    cellEl.addEventListener('click', () => {
      row.expanded = !row.expanded;
      if (!row.expanded) {
        const descendants = this.table.rowGroup.getGroupRows(row, this.table.rows);
        descendants.forEach(x => x.$$height = 0);
      } else {
        const descendants = this.table.rowGroup.getGroupRows(row, this.table.rows);
        descendants.forEach(x => x.$$height = null);
      }
      this.component.updateAllStyles();
    });
    return cellEl;
  }

}
