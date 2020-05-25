import { Listener } from '@mazdik-lib/common';
import { KeyElementChangeEventArgs } from './types';
import { DynamicFormElement } from './dynamic-form-element';
import { InputComponent } from './input.component';
import './custom-elements';
import { componentNames } from './custom-elements';

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
  }

  disconnectedCallback() {
    this.removeEventListeners();
    this.elements = [];
  }

  private render() {
    this.elements = [];
    this.dynElements.forEach(dynElement => {
      if (!dynElement.hidden) {
        dynElement.item = this.item;
        const element = this.createComponent(dynElement);

        this.listeners.push({
          eventName: 'valid',
          target: element,
          handler: this.onValid.bind(this)
        });
        this.listeners.push({
          eventName: 'loaded',
          target: element,
          handler: this.onLoaded.bind(this)
        });

        this.elements.push(element);
      }
    });
    this.append(...this.elements);
    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private createComponent(dynElement: DynamicFormElement): InputComponent {
    const component = componentNames.find(x => x.type === dynElement.type);
    let element;
    if (component) {
      element = document.createElement(component.name) as InputComponent;
    } else {
      element = document.createElement('web-form-input') as InputComponent;
    }
    element.dynElement = dynElement;
    element.disabled = this.isDisabled(dynElement);
    return element;
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
