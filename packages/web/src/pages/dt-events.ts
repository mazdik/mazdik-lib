import { Page } from '../page';
import '@mazdik-lib/data-table';
import { Listener } from '@mazdik-lib/common';
import { DataTableComponent, Settings, DataTable, EventHelper } from '@mazdik-lib/data-table';
import { getColumnsPlayers } from '../shared/columns';

export default class DtEventsDemo implements Page {

  get template(): string {
    return `<p>Events: contextmenu, mouseover, mouseout</p>
    <div style="position: relative;">
      <web-data-table></web-data-table>
      <div class="dt-message dt-message-success" style="word-break: break-all;"></div>
      <div class="tooltip"></div>
    </div>
    `;
  }
  private element: HTMLElement;
  private message: HTMLElement;
  private tooltip: HTMLElement;
  private table: DataTable;
  private currentElem: any;
  private timer: any;
  private listeners: Listener[] = [];

  load() {
    const component = document.querySelector('web-data-table') as DataTableComponent;

    const columns = getColumnsPlayers();
    const table = new DataTable(columns, new Settings());
    component.table = table;

    table.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        table.rows = data;
        table.events.emitLoading(false);
      });

    this.table = table;
    this.message = document.querySelector('.dt-message');
    this.tooltip = document.querySelector('.tooltip');
    this.element = document.querySelector('web-data-table .datatable') as HTMLElement;
    this.addEventListeners();
  }

  onDestroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'contextmenu',
        target: this.element,
        handler: this.onContextmenu.bind(this)
      },
      {
        eventName: 'mouseover',
        target: this.element,
        handler: this.onMouseover.bind(this)
      },
      {
        eventName: 'mouseout',
        target: this.element,
        handler: this.onMouseout.bind(this)
      },
    ];
    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onContextmenu(event: any) {
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.printEvent('contextmenu', cellEventArgs);
    }
  }

  private onMouseover(event: any): void {
    if (this.currentElem) {
      return;
    }
    const target = EventHelper.findCellEventTarget(event, this.element);
    if (!target) { return; }
    this.currentElem = target;

    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      //this.table.events.emitMouseover(cellEventArgs);
      this.printEvent('mouseover', cellEventArgs);
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.showTooltip(cellEventArgs.event);
        this.timer = null;
      }, 700);
    }
  }

  private onMouseout(event: any): void {
    if (!this.currentElem) {
      return;
    }
    let relatedTarget = event.relatedTarget;
    if (relatedTarget) {
      while (relatedTarget) {
        if (relatedTarget === this.currentElem) {
          return;
        }
        relatedTarget = relatedTarget.parentNode;
      }
    }
    this.currentElem = null;
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      //this.table.events.emitMouseout(cellEventArgs);
      this.hideTooltip();
    }
  }

  private showTooltip(event: MouseEvent) {
    const {left, top} = EventHelper.getRowPosition(event);
    this.tooltip.style.left = left + 'px';
    this.tooltip.style.top = top + 'px';
    this.tooltip.style.visibility = 'visible';
  }

  private hideTooltip() {
    this.tooltip.style.visibility = 'hidden';
  }

  private printEvent(name: string, event: any) {
    this.message.innerHTML = '';
    this.tooltip.innerHTML = '';

    this.message.append(...this.createMessageElements(name, event));
    this.tooltip.append(...this.createMessageElements(name, event));
  }

  private createMessageElements(name: string, event: any): HTMLElement[] {
    const elements = [];

    const b = document.createElement('b');
    b.innerText = name + ': ';
    elements.push(b);

    const columnName = this.table.columns[event.columnIndex].name;
    const cell = this.table.rows[event.rowIndex][columnName];
    const str = JSON.stringify({columnName, cell}, null, 2);
    const text = document.createTextNode(str);
    elements.push(text);

    return elements;
  }

}
