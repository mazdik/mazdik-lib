import { Keys, Listener } from '@mazdik-lib/common';
import { InlineEditComponent } from '@mazdik-lib/inline-edit';
import { BodyCell } from './body-cell';
import { DataTable, Row, Column, CellEventArgs, EditMode } from './base';

export class BodyCellEdit extends BodyCell {

  private tempValue: any;
  private inlineEdit: InlineEditComponent;
  private listeners: Listener[] = [];

  protected get editing(): boolean {
    return this._editing;
  }
  protected set editing(val: boolean) {
    this._editing = val;
    this.updateValue();
    if (val) {
      this.createInlineEditComponent();
    } else {
      this.destroyInlineEditComponent();
    }
    this.updateStyles();
  }
  private _editing: boolean;

  constructor(protected table: DataTable, row: Row, column: Column) {
    super(table, row, column);
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'valueChange',
        target: this.inlineEdit,
        handler: this.onValueChange.bind(this)
      },
      {
        eventName: 'blurChange',
        target: this.inlineEdit,
        handler: this.onInputBlur.bind(this)
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


  switchCellToEditMode() {
    if (this.cell.column.editable) {
      this.tempValue = this.cell.value;
      this.editing = true;
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.cell.value !== this.tempValue) {
      this.table.events.onCellValueChanged({ columnIndex: this.cell.column.index, rowIndex: this.cell.rowIndex } as CellEventArgs);
    }
  }

  onCellKeydown(event: any) {
    if (this.editing) {
      this.onCellEditorKeydown(event);
    } else {
      if (event.keyCode === Keys.KEY_F2 || event.keyCode === Keys.ENTER) {
        this.switchCellToEditMode();
      }
    }
    if (!this.cell.column.options) {
      event.preventDefault();
    }
  }

  private onCellEditorKeydown(event: any) {
    if (event.keyCode === Keys.ENTER) {
      this.switchCellToViewMode();
      this.element.focus();
    } else if (event.keyCode === Keys.ESCAPE) {
      this.cell.value = this.tempValue;
      this.editing = false;
      this.element.focus();
    }
  }

  private onValueChange(event: CustomEvent) {
    this.cell.value = event.detail;
    this.updateValue();
    this.updateStyles();
  }

  private onInputBlur() {
    if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
      this.switchCellToViewMode();
    }
  }

  private createInlineEditComponent() {
    this.inlineEdit = document.createElement('web-inline-edit') as InlineEditComponent;
    this.element.innerHTML = '';
    this.element.append(this.inlineEdit);

    let type = (this.cell.column.isDateType || this.cell.column.type === 'number') ? this.cell.column.type : 'text';
    if (this.cell.column.options) {
      type = 'select';
    }
    this.inlineEdit.type = type;
    this.inlineEdit.value = this.cell.value;
    this.inlineEdit.selectPlaceholder = this.table.messages.selectPlaceholder;
    this.inlineEdit.options = this.cell.getOptions();
    this.inlineEdit.editing = this.editing;

    this.addEventListeners();
  }

  private destroyInlineEditComponent() {
    this.removeEventListeners();
    this.createViewElement();
  }

}
