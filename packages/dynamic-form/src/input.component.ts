import { Listener, toggleClass } from '@mazdik-lib/common';
import { DynamicFormElement } from './dynamic-form-element';

export class InputComponent extends HTMLElement {

  get dynElement(): DynamicFormElement { return this._dynElement; }
  set dynElement(val: DynamicFormElement) {
    this._dynElement = val;
    this.onInit();
  }
  private _dynElement: DynamicFormElement;

  set disabled(val: boolean) {
    this.onDisabled(val);
  }

  set loading(val: boolean) {
    this.loader.style.display = val ? 'inline-block': 'none';
  }

  get value(): any { return this.dynElement.value; }
  set value(val: any) {
    if (this.dynElement.value !== val) {
      this.dynElement.value = val;
      this.dispatchEvent(new CustomEvent('valueChange', { detail: this.dynElement.value }));
      this.validate();
    }
  }

  wrapper: HTMLElement;
  loader: HTMLElement;
  label: HTMLLabelElement;
  helpBlock: HTMLElement;
  listeners: Listener[] = [];

  constructor() {
    super();
    this.wrapper = document.createElement('div');
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('dt-group');

    this.loader = document.createElement('i');
    this.loader.classList.add('dt-loader');
    this.loader.style.display = 'none';
    this.wrapper.append(this.loader);

    this.label = document.createElement('label');
    this.wrapper.append(this.label);

    this.helpBlock = document.createElement('div');
    this.helpBlock .classList.add('dt-help-block');
    this.wrapper.append(this.helpBlock);
  }

  connectedCallback() {
    this.append(this.wrapper);
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  onInit() {
    this.label.textContent = this.dynElement.title;
    this.validate();
  }

  onDisabled(val: boolean) {
    toggleClass(this.wrapper, 'disabled', val);
  }

  validate() {
    this.dynElement.validate();
    this.dispatchEvent(new CustomEvent('valid', { detail: !this.dynElement.hasError }));
    toggleClass(this.wrapper, 'dt-has-error', this.dynElement.hasError);

    const errorElements = [];
    this.dynElement.errors.forEach(error => {
      const element = document.createElement('div');
      element.textContent = error;
      errorElements.push(element);
    });
    this.helpBlock.innerHTML = '';
    this.helpBlock.append(...errorElements);
  }

}
