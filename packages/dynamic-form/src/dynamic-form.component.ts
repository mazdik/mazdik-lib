import { Listener } from '@mazdik-lib/common';
import { DynamicFormElement } from './dynamic-form-element';
import { InputBaseComponent } from './input-base.component';
import './custom-elements';
import { componentNames } from './custom-elements';

export class DynamicFormComponent extends HTMLElement {

  get item(): { [key: string]: any } { return this._item; }
  set item(val:  { [key: string]: any }) {
    this._item = val;
    this.isNewItem = val ? false : true;
    this.render()
  }
  private _item: { [key: string]: any } = {};

  get dynElements(): DynamicFormElement[] { return this._dynElements; }
  set dynElements(val: DynamicFormElement[]) {
    this._dynElements = val;
    this.render();
  }
  private _dynElements: DynamicFormElement[];

  private elements: InputBaseComponent[] = [];
  private listeners: Listener[] = [];
  private isNewItem: boolean = true;

  constructor() {
    super();
  }

  disconnectedCallback() {
    this.removeEventListeners();
    this.elements = [];
  }

  private render() {
    this.removeEventListeners();
    this.elements = [];

    this.dynElements.forEach(dynElement => {
      if (!dynElement.hidden) {
        dynElement.item = this.item;
        const element = this.createComponent(dynElement);

        this.listeners.push({
          eventName: 'valueChange',
          target: element,
          handler: this.onValueChange.bind(this)
        });
        this.listeners.push({
          eventName: 'valid',
          target: element,
          handler: this.onValid.bind(this)
        });

        this.elements.push(element);
      }
    });
    this.innerHTML = '';
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

  private createComponent(dynElement: DynamicFormElement): InputBaseComponent {
    const component = componentNames.find(x => x.type === dynElement.type);
    let element;
    if (component) {
      element = document.createElement(component.name) as InputBaseComponent;
    } else {
      element = document.createElement('web-form-input') as InputBaseComponent;
    }
    element.dynElement = dynElement;
    element.disabled = this.isDisabled(dynElement);
    return element;
  }

  private isDisabled(dynElement: DynamicFormElement) {
    return (!this.isNewItem && dynElement.disableOnEdit);
  }

  private onValueChange(event: CustomEvent<DynamicFormElement>) {
    this.elements.forEach(element => {
      if (element.dynElement.dependsElement === event.detail.name) {
        element['dependsValue'] = this.item[element.dynElement.dependsElement];
      }
      if (element.dynElement.name === event.detail.keyElement) {
        this.item[event.detail.keyElement] = event.detail.value;
        element.updateValue();
      }
    });
  }

  private onValid() {
    const result = this.dynElements.some(x => x.hasError);
    this.dispatchEvent(new CustomEvent('valid', { detail: !result }))
  }

}

customElements.define('web-dynamic-form', DynamicFormComponent);
