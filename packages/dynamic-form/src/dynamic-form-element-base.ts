import { SelectItem, InputType } from '@mazdik-lib/common';

export type GetOptionsFunc = (url: string, parentId: any) => Promise<any>;

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
  multiple: boolean;
  selectPlaceholder: string = 'Select...';
  searchInputPlaceholder: string = 'Search...';
  selectAllMessage?: string = 'Select all';
  cancelMessage?: string = 'Cancel';
  clearMessage?: string = 'Clear';
  selectedMessage?: string = 'Selected';

}
