import { DataTable } from './data-table';
import { Column } from './column';
import { Row } from './row';
import { Cell } from './cell';

export interface TemplateContext {
  table: DataTable;
  column?: Column;
  row?: Row;
  cell?: Cell;
}

export interface TemplateRenderer {
  create(context: TemplateContext): HTMLElement | DocumentFragment;
  destroy(): void;
  refresh(context: TemplateContext): void;
}
