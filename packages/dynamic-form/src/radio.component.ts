import { InputOptionComponent } from './input-option.component';

export class RadioComponent extends InputOptionComponent {

  private block: HTMLElement;
  private inputs: HTMLInputElement[] = [];

  onInit() {
    super.onInit();
    this.createElements();
    this.label.after(this.block);

    this.addEventListeners();
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    this.inputs.forEach(x => x.disabled = val);
  }

  private createElements() {
    this.block = document.createElement('div');
    const options = this.getOptions();
    options.forEach(option => {
      const div = document.createElement('div');
      div.classList.add('dt-radio');
      this.block.append(div)

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = this.dynElement.name;
      input.value = option.id;
      input.checked = this.value === option.id;
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

  private onChange(event: any) {
    this.value = event.target.value;
  }

}
