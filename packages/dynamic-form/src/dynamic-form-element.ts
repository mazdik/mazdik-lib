import { SelectItem, inputIsDateType, isBlank } from '@mazdik-lib/common';
import { DynamicFormElementBase } from './dynamic-form-element-base';

export class DynamicFormElement extends DynamicFormElementBase {

  item: { [key: string]: any } = {};

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
    return (this.keyElement && (this.type === 'select' || this.type === 'select-modal' || this.type === 'select-dropdown'));
  }

  errors: string[] = [];

  constructor(init: Partial<DynamicFormElementBase>) {
    super();
    Object.assign(this, init);
  }

  getOptions(dependsValue?: any): SelectItem[] {
    if (this.options) {
      if (this.dependsElement && !isBlank(dependsValue)) {
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
