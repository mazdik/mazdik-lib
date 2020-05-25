import { SelectItem } from '@mazdik-lib/common';
import { InputOptionComponent } from './input-option.component';

export class CheckboxComponent extends InputOptionComponent {

  private block: HTMLElement;
  private inputs: HTMLInputElement[] = [];

  constructor() {
    super();
    this.block = document.createElement('div');
  }

  onInit() {
    super.onInit();
    this.label.after(this.block);
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    this.inputs.forEach(x => x.disabled = val);
  }

  onLoadOptions() {
    super.onLoadOptions();
    this.createElements(this.getOptions());
    this.addEventListeners();
  }

  private createElements(options: SelectItem[]) {
    this.block.innerHTML = '';
    this.block = document.createElement('div');
    options.forEach(option => {
      const div = document.createElement('div');
      div.classList.add('dt-checkbox');
      this.block.append(div)

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = this.dynElement.name;
      input.value = option.id;
      input.checked = this.isSelectActive(option);
      div.append(input);

      const label = document.createElement('label');
      label.textContent = option.name ? option.name : option.id;
      div.append(label);

      this.inputs.push(input);

      this.listeners.push({
        eventName: 'change',
        target: input,
        handler: this.onChange.bind(this)
      });
    });
  }

  private addEventListeners() {
    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  isSelectActive(option: SelectItem): boolean {
    if (Array.isArray(this.value)) {
      return this.value.some(a => a === option.id);
    } else {
      return this.value === option.id;
    }
  }

  onChange(event: any) {
    const checkbox = event.target as HTMLInputElement;
    (checkbox.checked) ? this.check(checkbox.value) : this.uncheck(checkbox.value);
  }

  check(val: string) {
    if (Array.isArray(this.value)) {
      if (this.value.indexOf(val) === -1) {
        this.value.push(val);
      }
    } else {
      return this.value = val;
    }
  }

  uncheck(val: string) {
    if (Array.isArray(this.value)) {
      const index = this.value.indexOf(val);
      if (index > -1) {
        this.value.splice(index, 1);
      }
    } else {
      return this.value = null;
    }
  }

}
