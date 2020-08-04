import { Listener } from '@mazdik-lib/common';
import { DataTable, EventHelper, KeyboardAction, CellEventArgs, CellEventType } from './base';
import { BodyCell } from './body-cell';
import { BodyRow } from './body-row';

export class Body {

  element: HTMLElement;
  private bodyRows: BodyRow[] = [];
  private bodyCells: BodyCell[] = [];
  private listeners: Listener[] = [];
  private keyboardAction: KeyboardAction;

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-body');

    this.keyboardAction = new KeyboardAction(this.table.events, this.table.selection);
    this.addEventListeners();
  }

  destroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.element,
        handler: this.onСlick.bind(this)
      },
      {
        eventName: 'keydown',
        target: this.element,
        handler: this.onKeydown.bind(this)
      },
      {
        eventName: 'cell',
        target: this.table.events.element,
        handler: this.onCell.bind(this)
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

  createRows() {
    this.bodyRows = [];
    this.element.innerHTML = '';
    this.bodyCells = [];
    this.table.rows.forEach(row => {
      const bodyRow = new BodyRow(this.table, row);
      this.bodyRows.push(bodyRow);
      this.element.append(bodyRow.element);

      this.table.preparedColumns.forEach(column => {
        const bodyCell = new BodyCell(row, column);
        this.bodyCells.push(bodyCell);
        bodyRow.element.append(bodyCell.element);
      });
    });
  }

  updateBodyStyles() {
    this.bodyRows.forEach(x => x.updateStyles());
    this.bodyCells.forEach(x => x.updateStyles());
  }

  private onСlick(event: any) {
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.table.events.onClickCell(cellEventArgs);
      if (!this.table.settings.selectionMode) {
        this.table.selectRow(cellEventArgs.rowIndex);
      }
    }
  }

  private onKeydown(event: any): void {
    const maxColIndex = this.table.columns.length;
    const maxRowIndex = this.table.rows.length;
    this.keyboardAction.handleEvent(event, this.element, maxColIndex, maxRowIndex);
  }

  private findBodyCell(columnIndex: number, rowIndex: number): BodyCell {
    return this.bodyCells.find(x => x.cell.column.index === columnIndex && x.cell.rowIndex === rowIndex);
  }

  private onCell(event: CustomEvent<CellEventArgs>) {
    const data = event.detail;
    const cell = this.findBodyCell(data.columnIndex, data.rowIndex);
    if (cell && data.type === CellEventType.Activate) {
      cell.element.focus();
    }
  }

}
