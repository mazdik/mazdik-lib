import { DataTable } from './data-table';
import { Row } from './row';
import { Cell } from './cell';

export interface TemplateContext {
  table: DataTable;
  row?: Row;
  cell?: Cell;
}

export interface TemplateRenderer {
  create(context: TemplateContext): HTMLElement;
  destroy(): void;
}
