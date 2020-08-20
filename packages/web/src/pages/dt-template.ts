import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, TemplateRenderer, TemplateContext, ColumnBase, FilterOperator } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';
import { Listener } from '@mazdik-lib/common';

export class HeaderCellTemplateRenderer implements TemplateRenderer {

  private fragments: DocumentFragment[] = [];
  private listeners: Listener[] = [];

  create(context: TemplateContext): DocumentFragment {
    const fragment = document.createDocumentFragment();

    const imgAsm = document.createElement('img');
    imgAsm.classList.add('pointer', 'dt-template-demo-img');
    imgAsm.src = 'assets/asmodian.png';
    imgAsm.title = 'ASMODIANS';
    fragment.append(imgAsm);

    const strong = document.createElement('strong');
    strong.classList.add('pointer');
    strong.title = context.table.messages.clearFilters;
    strong.textContent = context.column.title;
    fragment.append(strong);

    const imgEly = document.createElement('img');
    imgEly.classList.add('pointer', 'dt-template-demo-img');
    imgEly.src = 'assets/elyos.png';
    imgEly.title = 'ELYOS';
    fragment.append(imgEly);

    this.addListener({
      eventName: 'click',
      target: imgAsm,
      handler: this.clickRaceFilter.bind(this, context.table, 'ASMODIANS')
    });
    this.addListener({
      eventName: 'click',
      target: strong,
      handler: this.clickRaceFilter.bind(this, context.table, null)
    });
    this.addListener({
      eventName: 'click',
      target: imgEly,
      handler: this.clickRaceFilter.bind(this, context.table, 'ELYOS')
    });

    this.fragments.push(fragment);
    return fragment;
  }

  destroy() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
    this.fragments = [];
  }

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private clickRaceFilter(table: DataTable, value: string) {
    table.dataFilter.setFilter(value, 'race', FilterOperator.EQUALS);
    table.events.emitFilter();
  }
}

export class CellTemplateRenderer implements TemplateRenderer {

  private fragments: DocumentFragment[] = [];

  create(context: TemplateContext): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const img = document.createElement('img');
    img.classList.add('dt-template-demo-img');
    img.src = context.cell.value === 'ASMODIANS' ? 'assets/asmodian.png' : 'assets/elyos.png';
    img.title = context.cell.viewValue;
    fragment.append(img);
    const text = document.createTextNode(context.cell.viewValue);
    fragment.append(text);

    this.fragments.push(fragment);
    return fragment;
  }

  destroy() {
    this.fragments = [];
  }
}

export class HeaderRnCellTemplateRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];
  private listeners: Listener[] = [];

  create(context: TemplateContext): HTMLElement {
    const element = document.createElement('button');
    element.classList.add('filter-action');
    element.title = context.table.messages.clearFilters;
    element.style.visibility = (!context.table.dataFilter.hasFilters()) ? 'hidden' : 'visible';

    const icon = document.createElement('i');
    icon.classList.add('dt-icon-filter');
    element.append(icon);

    this.addListener({
      eventName: 'click',
      target: element,
      handler: this.clearAllFilters.bind(this, context.table, null)
    });

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

  refresh(context: TemplateContext) {
    this.elements.forEach(element => {
      element.style.visibility = (!context.table.dataFilter.hasFilters()) ? 'hidden' : 'visible';
    });
  }

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private clearAllFilters(table: DataTable) {
    table.dataFilter.clear();
    table.events.emitFilter();
  }
}

export class RnCellTemplateRenderer implements TemplateRenderer {

  private elements: HTMLElement[] = [];

  create(context: TemplateContext): HTMLElement {
    const element = document.createElement('div');
    element.classList.add('cell-data');
    element.textContent = (context.cell.row.$$index + 1).toString();

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
