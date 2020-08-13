import { BodyCell } from './body-cell';
import { DataTable, Row, Column } from './base';

export class BodyCellView extends BodyCell {

  constructor(protected table: DataTable, row: Row, column: Column) {
    super(table, row, column);
  }

  switchCellToEditMode() {}

  switchCellToViewMode() {}

  onCellKeydown(event: any) {}

}
