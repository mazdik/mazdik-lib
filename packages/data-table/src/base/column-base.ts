import { AggregateType, DataType, PipeTransform } from './types';
import { SelectItem, InputType } from '@mazdik-lib/common';
import { TemplateRenderer } from './template-renderer';

type FilterValuesFunc = (columnName: string) => Promise<SelectItem[]>;
type CellClassFunc = (obj: any) => any;

export class ColumnBase {

  name: string;
  title: string;
  sortable?: boolean = true;
  filter?: boolean = true;
  options?: SelectItem[];
  optionsUrl?: string;
  width?: number = null;
  frozen?: boolean;
  type?: InputType;
  validatorFunc?: (name: string, value: any) => string[];
  editable?: boolean;
  resizeable?: boolean = true;
  dependsColumn?: string;
  cellTemplate?: TemplateRenderer;
  formTemplate?: TemplateRenderer;
  headerCellTemplate?: TemplateRenderer;
  formHidden?: boolean;
  tableHidden?: boolean;
  cellClass?: string | CellClassFunc;
  headerCellClass?: string;
  keyColumn?: string;
  multiSelectFilter?: boolean;
  minWidth?: number = 50;
  maxWidth?: number = 500;
  aggregation?: AggregateType;
  filterValues?: FilterValuesFunc | SelectItem[] | string;
  dataType?: DataType;
  formDisableOnEdit?: boolean;
  pipe?: PipeTransform;
}
