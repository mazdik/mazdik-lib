import { GetOptionsFunc, KeyElementChangeEventArgs } from './types';
import { DynamicFormElement } from './dynamic-form-element';

export class DynamicFormComponent extends HTMLElement {

  dynElements: DynamicFormElement[];
  item: any;
  isNewItem: boolean = true;
  getOptionsFunc: GetOptionsFunc;
  selectPlaceholder: string;
  searchInputPlaceholder: string;

  private validElements: any = {};

  constructor() {
    super();
  }

  elemEnabled(dynElement: DynamicFormElement): boolean {
    return (!dynElement.hidden);
  }

  onValid(event: any, dynElement: DynamicFormElement) {
    this.validElements[dynElement.name] = event;
    this.isValid();
  }

  isValid() {
    const result = Object.keys(this.validElements).some(x => this.validElements[x] === false);
    this.dispatchEvent(new CustomEvent('valid', {detail: !result}));
  }

  onLoaded(event) {
    this.dispatchEvent(new CustomEvent('loaded', {detail: event}));
  }

  onKeyElementChange(event: KeyElementChangeEventArgs) {
    this.item[event.keyElementName] = event.keyElementValue;
    this.item[event.elementName] = event.elementValue;
  }

  isDisabled(dynElement: DynamicFormElement) {
    return (!this.isNewItem && dynElement.disableOnEdit);
  }

  onSelectPopupNameChanged(value: any, dynElement: DynamicFormElement) {
    if (dynElement.keyElement) {
      this.item[dynElement.name] = value;
    }
  }

}

customElements.define('web-dynamic-form', DynamicFormComponent);
