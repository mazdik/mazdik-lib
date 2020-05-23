import {SelectItem, InputType, inputIsDateType} from '@mazdik-lib/common';

export class DynamicFormElement {

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

  errors: string[] = [];

  getOptions(dependsValue?: any): SelectItem[] {
    if (this.options) {
      if (this.dependsElement && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
      }
    }
  }

  validate(value: any): void {
    if (this.validatorFunc) {
      this.errors = this.validatorFunc(this.title, value);
    }
  }

  get isDateType(): boolean {
    return inputIsDateType(this.type);
  }

  get hasError(): boolean {
    return (this.errors && this.errors.length > 0);
  }

}
