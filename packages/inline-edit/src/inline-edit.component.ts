import {
  SelectItem, Listener, inputFormattedDate, inputIsDateType, checkStrDate, isBlank
} from '@mazdik-lib/common';

function getTemplate() {
  return `
  <div class="dt-inline-data"></div>
  <select
    (change)="onInput($event); onInputChange()"
    (focus)="onInputFocus()"
    (blur)="onInputBlur()">
  </select>
  <input (input)="onInput($event)"
          (keyup)="onInputChange()"
          (focus)="onInputFocus()"
          (blur)="onInputBlur()"/>
  `;
}

export class InlineEditComponent extends HTMLElement {

  selectPlaceholder: string = '';

  get type(): string { return this._type; }
  set type(val: string) {
    this._type = val;
    this.setInputType();
    this.updateStyles();
    this.input.value = this.inputFormattedValue || null;
  }
  private _type: string = 'text';

  get editing(): boolean { return this._editing; }
  set editing(val: boolean) {
    this._editing = val;
    this.updateStyles();
    this.setFocus();
  }
  private _editing: boolean;

  get value(): string | number | Date { return this._value; }
  set value(val: string | number | Date) {
    this._value = val;
    this.input.value = this.inputFormattedValue || null;
    this.setSelectedIndex();
    this.setViewValue();
  }
  private _value: string | number | Date;

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    this.loadSelect(val, this.selectPlaceholder);
    this.setViewValue();
  }
  private _options: SelectItem[];

  get isDateType(): boolean {
    return inputIsDateType(this.type);
  }

  get inputFormattedValue() {
    if (this.isDateType) {
      return inputFormattedDate(this.type, this.value);
    }
    return this.value;
  }

  private listeners: Listener[] = [];
  private inlineDataView: HTMLElement;
  private select: HTMLSelectElement;
  private input: HTMLInputElement;

  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = getTemplate();
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-inline-editor');

    this.inlineDataView = this.querySelector('.dt-inline-data');
    this.select = this.querySelector('select');
    this.input = this.querySelector('input');

    this.select.style.display = 'block';
    this.input.style.display = 'block';

    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      // {
      //   eventName: 'open',
      //   target: this,
      //   handler: this.onOpenChange.bind(this)
      // },
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
    if (this.type === 'number') {
      this._value = !isBlank(event.target.value) ? parseFloat(event.target.value) : null;
    } else if (this.isDateType) {
      if (checkStrDate(event.target.value)) {
        this.value = new Date(event.target.value);
      }
    } else {
      this._value = event.target.value;
    }
    this.dispatchEvent(new CustomEvent('valueChange', { detail: this.value }));
  }

  private onInputChange() {
    this.dispatchEvent(new CustomEvent('inputChange'));
  }

  private onInputFocus() {
    this.dispatchEvent(new CustomEvent('focusChange'));
  }

  private onInputBlur() {
    this.dispatchEvent(new CustomEvent('blurChange'));
  }

  private updateStyles() {
    if (this.editing) {
      this.inlineDataView.style.display = 'none';
      if (this.options) {
        this.select.style.display = 'block';
      } else {
        this.input.style.display = 'block';
      }
    } else {
      this.inlineDataView.style.display = 'block';
      this.select.style.display = 'none';
      this.input.style.display = 'none';
    }
  }

  private setFocus() {
    if (this.options) {
      this.select.focus();
    } else {
      this.input.focus();
    }
  }

  private loadSelect(options: SelectItem[], placeholder: string) {
    this.select.innerHTML = `<option value="" disabled selected hidden>${placeholder}</option>`;
    for (const option of options) {
      this.select.options.add(new Option(option.name, option.id));
    }
    this.setSelectedIndex();
  }

  private setSelectedIndex() {
    if (this.options && this.options.length) {
      const index = this.options.findIndex(x => x.id === this.value.toString()) || -2;
      this.select.selectedIndex = index + 1;
    }
  }

  private setInputType() {
    if (this.type !== 'select') {
      this.input.type = this.type;
      this.input.step = (this.type === 'number') ? 'any' : null;
    }
  }

  private setViewValue() {
    let viewValue = '';
    if (this.options && this.options.length) {
      const selected = this.options.find(x => x.id === this.value.toString());
      viewValue = selected ? selected.name : '';
    } else {
      viewValue = this.value.toString();
    }
    this.inlineDataView.innerText = viewValue;
  }

}

customElements.define('web-inline-edit', InlineEditComponent);
