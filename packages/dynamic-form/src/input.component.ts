import { isBlank, inputFormattedDate, inputIsDateType } from '@mazdik-lib/common';
import { InputBaseComponent } from './input-base.component';

export class InputComponent extends InputBaseComponent {

  private input: HTMLInputElement;

  constructor() {
    super();
    this.input = document.createElement('input');
    this.input.classList.add('dt-input');
  }

  onInit() {
    super.onInit();
    this.label.after(this.input);
    this.input.type = this.dynElement.type;
    this.input.placeholder = this.dynElement.title;
    this.input.value = this.getInputFormattedValue();

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
    this.value = event.target.value;
  }

  private getInputFormattedValue() {
    const val = inputIsDateType(this.dynElement.type) ? inputFormattedDate(this.dynElement.type, this.value) : this.value;
    return !isBlank(val) ? val : null;
  }


}
