import { DataTable } from './data-table';

export interface TemplateRenderer {
  create(table: DataTable, ...args: any[]): HTMLElement;
  destroy(): void;
}
