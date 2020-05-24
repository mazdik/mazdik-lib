import { Listener } from '@mazdik-lib/common';
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

  wrapper: HTMLElement;
  label: HTMLLabelElement;
  helpBlock: HTMLElement;
  listeners: Listener[] = [];

  constructor() {
    super();
    this.wrapper = document.createElement('div');
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('dt-group');

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

  }

  validate() {
    this.dynElement.validate();
    this.dispatchEvent(new CustomEvent('valid', { detail: !this.dynElement.hasError }));
  }

}
