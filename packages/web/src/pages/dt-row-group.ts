import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, TemplateRenderer, Row } from '@mazdik-lib/data-table';
import { Listener } from '@mazdik-lib/common';
import { getColumnsPlayers } from '../shared/columns';

export class CustomRowGroupRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];
  private listeners: Listener[] = [];

  create(table: DataTable, row: Row): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('datatable-body-row', 'datatable-group-header');
    element.style.height = table.dimensions.rowHeight + 'px';

    const cellEl = this.createCellElement(table, row);
    element.append(cellEl);

    this.elements.push(element);
    return element;
  }

  destroy() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
    this.elements.forEach(x => x.remove());
    this.elements = [];
  }

  private createCellElement(table: DataTable, row: any) {
    const cellEl = document.createElement('div');
    cellEl.classList.add('datatable-body-cell', 'dt-sticky', 'pointer');
    cellEl.style.left = '0';

    const iconElement = document.createElement('i');
    iconElement.className = (!row.expanded) ? 'dt-icon-node dt-icon-collapsed' : 'dt-icon-node';
    cellEl.append(iconElement);

    const text = table.rowGroup.getRowGroupName(row) + ' (' + table.rowGroup.getRowGroupSize(row) + ')';
    const textElement = document.createTextNode(text);
    cellEl.append(textElement);

    const listener = {
      eventName: 'click',
      target: cellEl,
      handler: this.onExpanded.bind(this, table, row)
    };
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);

    return cellEl;
  }

  private onExpanded(table: DataTable, row: any) {
    row.expanded = !row.expanded;
    if (!row.expanded) {
      const descendants = table.rowGroup.getGroupRows(row, table.rows);
      descendants.forEach(x => x.$$height = 0);
    } else {
      const descendants = table.rowGroup.getGroupRows(row, table.rows);
      descendants.forEach(x => x.$$height = null);
    }
    table.events.emitUpdateStyles();
  }

}

export default class DtRowGroupDemo implements Page {

  get template(): string {
    return `<web-data-table></web-data-table>`;
  }

  private component: DataTableComponent;

  load() {
    this.component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'race').tableHidden = true;
    const settings = new Settings({
      groupRowsBy: ['race'],
      rowHeightProp: '$$height',
      rowGroupRenderer: new CustomRowGroupRenderer(),
    });
    const table = new DataTable(columns, settings);
    table.pager.perPage = 50;
    this.component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(x => x.expanded = true);
        table.rows = data;
        table.events.emitLoading(false);
      });
  }

}
