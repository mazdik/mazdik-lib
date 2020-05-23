import { SelectItem, InputType, inputIsDateType } from '@mazdik-lib/common';
import { GetOptionsFunc } from './types';

export class DynamicFormElement {

  title: string;
  name: string;
  item: any;
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

  errors: string[] = [];

  get value(): any {
    return this.hasKeyElement ? this.item[this.keyElement] : this.item[this.name];
  }
  set value(val: any) {
    if (this.hasKeyElement) {
      this.item[this.keyElement] = val;
    } else {
      this.item[this.name] = val;
    }
  }

  get isDateType(): boolean {
    return inputIsDateType(this.type);
  }

  get hasError(): boolean {
    return (this.errors && this.errors.length > 0);
  }

  get hasKeyElement(): boolean {
    return (this.keyElement && (this.type === 'select' || this.type === 'select-popup' || this.type === 'select-dropdown'));
  }

  getOptions(dependsValue?: any): SelectItem[] {
    if (this.options) {
      if (this.dependsElement && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
      }
    }
  }

  validate(): void {
    if (this.validatorFunc) {
      this.errors = this.validatorFunc(this.title, this.value);
    }
  }

}
