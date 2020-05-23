import { Listener } from '@mazdik-lib/common';
import { KeyElementChangeEventArgs } from './types';
import { DynamicFormElement } from './dynamic-form-element';
import './input-text.component';
import { InputTextComponent } from './input-text.component';

export class DynamicFormComponent extends HTMLElement {

  item: any = {};
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
        const element = document.createElement('web-form-input-text') as InputTextComponent;
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
    this.dispatchEvent(new CustomEvent('valid', {detail: !result}))
  }

  onLoaded(event) {
    this.dispatchEvent(new CustomEvent('loaded', {detail: event}));
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
