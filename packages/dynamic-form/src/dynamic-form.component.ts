import { Listener } from '@mazdik-lib/common';
import { KeyElementChangeEventArgs } from './types';
import { DynamicFormElement } from './dynamic-form-element';
import { InputTextComponent } from './input-text.component';
import { SelectComponent } from './select.component';
import { TextareaComponent } from './textarea.component';

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
    customElements.define('web-form-input-text', InputTextComponent);
    customElements.define('web-form-select', SelectComponent);
    customElements.define('web-form-textarea', TextareaComponent);
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
        } else {
          element = document.createElement('web-form-input-text') as InputTextComponent;
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

  onSelectPopupNameChanged(value: any, dynElement: DynamicFormElement) {
    if (dynElement.keyElement) {
      this.item[dynElement.name] = value;
    }
  }

}

customElements.define('web-dynamic-form', DynamicFormComponent);
