import { Listener } from '@mazdik-lib/common';
import { DynamicFormElement } from './dynamic-form-element';

// @Component({
//   selector: 'app-form-input-text',
//   template: `
//     <div class="dt-group" [ngClass]="{'dt-has-error':dynElement.hasError}">
//       <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
//       <input type="text"
//              class="dt-input"
//              placeholder="{{dynElement.title}}"
//              id="{{dynElement.name}}"
//              [value]="model || null"
//              (input)="model = $event.target.value"
//              [disabled]="disabled"/>
//       <div class="dt-help-block">
//         <span *ngFor="let err of dynElement.errors">{{err}}<br></span>
//       </div>
//     </div>
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
export class InputTextComponent extends HTMLElement {

  get dynElement(): DynamicFormElement { return this._dynElement; }
  set dynElement(val: DynamicFormElement) {
    this._dynElement = val;
    this.input.placeholder = this.dynElement.title;
    this.input.value = this.dynElement.value;
  }
  private _dynElement: DynamicFormElement;

  set disabled(val: boolean) {
    this.input.disabled = val;
  }

  private input: HTMLInputElement;
  private listeners: Listener[] = [];

  constructor() {
    super();
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.classList.add('dt-input');
    this.appendChild(this.input);

    this.validate();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'input',
        target: this.input,
        handler: this.onInput.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onInput(event: any) {
    this.dynElement.value = event.target.value;
    this.dispatchEvent(new CustomEvent('valueChange', { detail: this.dynElement.value }));
    this.validate();
  }

  private validate() {
    this.dynElement.validate();
    this.dispatchEvent(new CustomEvent('valid', { detail: !this.dynElement.hasError }));
  }

  private createWrapperElement(dynElement: DynamicFormElement): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('dt-group');

    const label = document.createElement('label');
    label.textContent = dynElement.title;
    div.appendChild(label);

    const block = document.createElement('div');
    block.classList.add('dt-help-block');
    div.appendChild(block);

    return div;
  }

}

customElements.define('web-form-input-text', InputTextComponent);
