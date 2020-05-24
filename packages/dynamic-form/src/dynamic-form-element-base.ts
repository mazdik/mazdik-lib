import { SelectItem, InputType } from '@mazdik-lib/common';
import { GetOptionsFunc } from './types';

export class DynamicFormElementBase {

  title: string;
  name: string;
  options?: SelectItem[];
  optionsUrl?: string;
  type?: InputType;
  validatorFunc?: (name: string, value: any) => string[];
  dependsElement?: string;
  cellTemplate?: any;
  hidden?: boolean;
  keyElement?: string;
  disableOnEdit?: boolean;
  getOptionsFunc: GetOptionsFunc;
  selectPlaceholder: string = 'Select...';
  searchInputPlaceholder: string = 'Search...';

}
