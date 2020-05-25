import { isBlank } from '@mazdik-lib/common';
import { InputBaseComponent } from './input-base.component';

export class TextareaComponent extends InputBaseComponent {

  private textarea: HTMLTextAreaElement;

  constructor() {
    super();
    this.textarea = document.createElement('textarea');
    this.textarea.classList.add('dt-input');
  }

  onInit() {
    super.onInit();
    this.label.after(this.textarea);
    this.textarea.placeholder = this.dynElement.title;
    this.textarea.value = !isBlank(this.value) ? this.value : null;

    this.addEventListeners();
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    this.textarea.disabled = val;
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'input',
        target: this.textarea,
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

}
