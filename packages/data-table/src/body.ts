import { Listener } from '@mazdik-lib/common';
import '@mazdik-lib/inline-edit';
import { DataTable, EventHelper, KeyboardAction, CellEventArgs, CellEventType, Row, EditMode } from './base';
import { BodyRow } from './body-row';
import { BodyCell } from './body-cell';
import { BodyCellView } from './body-cell-view';
import { BodyCellEdit } from './body-cell-edit';

export class Body {

  element: HTMLElement;
  private bodyRows: BodyRow[] = [];
  private bodyCells: BodyCell[] = [];
  private listeners: Listener[] = [];
  private keyboardAction: KeyboardAction;

  get viewRows(): Row[] {
    return (this.table.settings.virtualScroll) ? this._viewRows : this.table.rows;
  }
  set viewRows(val: Row[]) {
    this._viewRows = val;
  }
  private _viewRows: Row[];

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
        eventName: 'dblclick',
        target: this.element,
        handler: this.onDblClick.bind(this)
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
    this.bodyRows.forEach(x => x.element.remove());
    this.bodyRows = [];
    this.bodyCells = [];
    this.viewRows.forEach(row => {
      const bodyRow = new BodyRow(this.table, row);
      this.bodyRows.push(bodyRow);
      this.element.append(bodyRow.element);

      this.table.preparedColumns.forEach(column => {
        const bodyCell = column.editable ? new BodyCellEdit(this.table, row, column) : new BodyCellView(this.table, row, column);
        this.bodyCells.push(bodyCell);
        bodyRow.element.append(bodyCell.element);
      });
    });
  }

  updateBodyStyles() {
    this.bodyRows.forEach(x => x.updateStyles());
    this.bodyCells.forEach(x => x.updateStyles());
  }

  private onСlick(event: any): void {
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.table.events.onClickCell(cellEventArgs);
      if (!this.table.settings.selectionMode) {
        this.table.selectRow(cellEventArgs.rowIndex);
      }
    }
  }

  private onDblClick(event: any): void {
    const cellEventArgs = EventHelper.findCellEvent(event, this.element);
    if (cellEventArgs) {
      this.table.events.onDblClickCell(cellEventArgs);
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
    const ev = event.detail;
    const cell = this.findBodyCell(ev.columnIndex, ev.rowIndex);
    if (!cell) {
      return;
    }
    if (ev.type === CellEventType.Activate) {
      cell.element.focus();
    }
    if (ev.type === CellEventType.DblClick) {
      if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
        cell.switchCellToEditMode();
      }
    }
    if (ev.type === CellEventType.Keydown) {
      if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
        cell.onCellKeydown(ev.event);
      }
    }
    if (ev.type === CellEventType.EditMode) {
      if (ev.editMode) {
        cell.switchCellToEditMode();
      } else {
        cell.switchCellToViewMode();
      }
    }
  }

}
