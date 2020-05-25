import { Listener } from '@mazdik-lib/common';
import { KeyElementChangeEventArgs } from './types';
import { DynamicFormElement } from './dynamic-form-element';
import { InputComponent } from './input.component';
import { SelectComponent } from './select.component';
import { TextareaComponent } from './textarea.component';
import { CheckboxComponent } from './checkbox.component';
import { RadioComponent } from './radio.component';
import { SelectDropdownComponent } from './select-dropdown.component';
import { SelectModalComponent } from './select-modal.component';

export class DynamicFormComponent extends HTMLElement {

  item: { [key: string]: any } = {};
  isNewItem: boolean = true;

  get dynElements(): DynamicFormElement[] { return this._dynElements; }
  set dynElements(val: DynamicFormElement[]) {
    this._dynElements = val;
    this.render();
  }
  private _dynElements: DynamicFormElement[];

  private elements: HTMLElement[] = [];
  private listeners: Listener[] = [];

  constructor() {
    super();
    customElements.define('web-form-input', InputComponent);
    customElements.define('web-form-select', SelectComponent);
    customElements.define('web-form-textarea', TextareaComponent);
    customElements.define('web-form-checkbox', CheckboxComponent);
    customElements.define('web-form-radio', RadioComponent);
    customElements.define('web-form-select-dropdown', SelectDropdownComponent);
    customElements.define('web-form-select-modal', SelectModalComponent);
  }

  disconnectedCallback() {
    this.removeEventListeners();
    this.elements = [];
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private render() {
    this.elements = [];
    this.dynElements.forEach(dynElement => {
      if (!dynElement.hidden) {
        dynElement.item = this.item;

        let element;
        if (dynElement.type === 'select') {
          element = document.createElement('web-form-select') as SelectComponent;
        } else if (dynElement.type === 'textarea') {
          element = document.createElement('web-form-textarea') as TextareaComponent;
        } else if (dynElement.type === 'checkbox') {
          element = document.createElement('web-form-checkbox') as CheckboxComponent;
        } else if (dynElement.type === 'radio') {
          element = document.createElement('web-form-radio') as RadioComponent;
        } else if (dynElement.type === 'select-dropdown') {
          element = document.createElement('web-form-select-dropdown') as SelectDropdownComponent;
        } else if (dynElement.type === 'select-modal') {
          element = document.createElement('web-form-select-modal') as SelectModalComponent;
        } else {
          element = document.createElement('web-form-input') as InputComponent;
        }
        element.dynElement = dynElement;
        element.disabled = this.isDisabled(dynElement);

        this.listeners.push({
          eventName: 'valid',
          target: element,
          handler: this.onValid.bind(this)
        });

        this.elements.push(element);
      }
    });
    this.append(...this.elements);
  }

  private isDisabled(dynElement: DynamicFormElement) {
    return (!this.isNewItem && dynElement.disableOnEdit);
  }

  private onValid() {
    const result = this.dynElements.some(x => x.hasError);
    this.dispatchEvent(new CustomEvent('valid', { detail: !result }))
  }

  onLoaded(event) {
    this.dispatchEvent(new CustomEvent('loaded', { detail: event }));
  }

  onKeyElementChange(event: KeyElementChangeEventArgs) {
    this.item[event.keyElementName] = event.keyElementValue;
    this.item[event.elementName] = event.elementValue;
  }

}

customElements.define('web-dynamic-form', DynamicFormComponent);
