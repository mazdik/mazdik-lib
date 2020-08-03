import { DataTable } from './base';
import { BodyCell } from './body-cell';
import { BodyRow } from './body-row';

export class Body {

  element: HTMLElement;
  private bodyRows: BodyRow[] = [];
  private bodyCells: BodyCell[] = [];

  constructor(private table: DataTable) {

  }

}
