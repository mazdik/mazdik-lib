import { isBlank } from '@mazdik-lib/common';
import { InputOptionComponent } from './input-option.component';

export class SelectComponent extends InputOptionComponent {

  private select: HTMLSelectElement;

  constructor() {
    super();
    this.select = document.createElement('select');
    this.select.classList.add('dt-input');
  }

  onInit() {
    super.onInit();
    this.label.after(this.select);

    this.loadSelect();
    this.addEventListeners();
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    this.select.disabled = val;
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'change',
        target: this.select,
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
    this.onValueChange();
  }

  private loadSelect() {
    this.select.innerHTML = `<option value="" disabled selected hidden>${this.dynElement.selectPlaceholder}</option>`;
    const options = this.getOptions();
    for (const option of options) {
      this.select.options.add(new Option(option.name, option.id));
    }
    this.setSelectedIndex();
  }

  private setSelectedIndex() {
    const options = this.getOptions();
    if (!isBlank(options) && !isBlank(this.dynElement.value)) {
      let index = options.findIndex(x => x.id === this.dynElement.value.toString());
      index = (index >= 0) ? index + 1 : index; // + 1 selectPlaceholder
      this.select.selectedIndex = index;
    }
  }

}
