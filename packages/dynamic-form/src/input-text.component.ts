import { isBlank } from '@mazdik-lib/common';
import { InputComponent } from './input.component';

export class InputTextComponent extends InputComponent {

  private input: HTMLInputElement;

  constructor() {
    super();
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.classList.add('dt-input');
  }

  onInit() {
    super.onInit();
    this.label.after(this.input);
    this.input.placeholder = this.dynElement.title;
    this.input.value = !isBlank(this.dynElement.value) ? this.dynElement.value : null;

    this.addEventListeners();
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    this.input.disabled = val;
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

  private onInput(event: any) {
    this.dynElement.value = event.target.value;
    this.dispatchEvent(new CustomEvent('valueChange', { detail: this.dynElement.value }));
    this.validate();
  }

}
