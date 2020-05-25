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

    this.addEventListeners();
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    this.select.disabled = val;
  }

  onLoadOptions() {
    super.onLoadOptions();
    this.loadSelect();
    this.setSelectedIndex();
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
    this.value = event.target.value;
    this.onValueChange();
  }

  private loadSelect() {
    this.select.options.length = 0;

    const defaultOption = new Option(this.dynElement.selectPlaceholder, '', false, true);
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    this.select.options.add(defaultOption);

    const options = this.getOptions();
    for (const option of options) {
      this.select.options.add(new Option(option.name, option.id));
    }
  }

  private setSelectedIndex() {
    const options = this.getOptions();
    if (!isBlank(options) && !isBlank(this.value)) {
      let index = options.findIndex(x => x.id === this.value.toString());
      index = (index >= 0) ? index + 1 : index; // + 1 selectPlaceholder
      this.select.selectedIndex = index;
    }
  }

}
