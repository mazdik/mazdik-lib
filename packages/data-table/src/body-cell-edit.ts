import { Keys } from '@mazdik-lib/common';
import { BodyCell } from './body-cell';
import { DataTable, Row, Column, CellEventArgs, EditMode } from './base';

export class BodyCellEdit extends BodyCell {

  private tempValue: any;

  constructor(protected table: DataTable, row: Row, column: Column) {
    super(table, row, column);
  }

  switchCellToEditMode() {
    if (this.cell.column.editable) {
      this.editing = true;
      this.cell.validate();
      this.updateStyles();
    }
  }

  switchCellToViewMode() {
    this.editing = false;
    if (this.cell.value !== this.tempValue) {
      this.updateValue();
      this.table.events.onCellValueChanged({
        columnIndex: this.cell.column.index,
        rowIndex: this.cell.rowIndex
      } as CellEventArgs);
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
      this.editing = false;
      this.cell.value = this.tempValue;
      this.updateValue();
      this.element.focus();
    }
  }

  private onInputBlur() {
    if (this.table.settings.editMode !== EditMode.EditProgrammatically) {
      this.switchCellToViewMode();
    }
  }

  private onInputFocus() {
    this.tempValue = this.cell.value;
  }

}
