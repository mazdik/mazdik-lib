import {
  SelectItem, Listener, inputFormattedDate, inputIsDateType, checkStrDate, isBlank
} from '@mazdik-lib/common';

export class InlineEditComponent extends HTMLElement {

  selectPlaceholder: string = '';

  get type(): string { return this._type; }
  set type(val: string) {
    this._type = val;
    this.setInputType();
    this.updateStyles();
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
    this.firstInitValue();
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
  private initValue: boolean = false;

  constructor() {
    super();
    this.classList.add('dt-inline-editor');

    this.inlineDataView = document.createElement('div');
    this.inlineDataView.classList.add('dt-inline-data');
    this.appendChild(this.inlineDataView);

    this.select = document.createElement('select');
    this.input = document.createElement('input');

    this.select.style.display = 'block';
    this.input.style.display = 'block';

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
      {
        eventName: 'focus',
        target: this.input,
        handler: this.onInputFocus.bind(this)
      },
      {
        eventName: 'blur',
        target: this.input,
        handler: this.onInputBlur.bind(this)
      },
      // select
      {
        eventName: 'change',
        target: this.select,
        handler: this.onInput.bind(this)
      },
      {
        eventName: 'focus',
        target: this.select,
        handler: this.onInputFocus.bind(this)
      },
      {
        eventName: 'blur',
        target: this.select,
        handler: this.onInputBlur.bind(this)
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
    if (this.type === 'number') {
      this.value = !isBlank(event.target.value) ? parseFloat(event.target.value) : null;
    } else if (this.isDateType) {
      if (checkStrDate(event.target.value)) {
        this.value = new Date(event.target.value);
      }
    } else {
      this.value = event.target.value;
    }
    this.dispatchEvent(new CustomEvent('valueChange', { detail: this.value }));
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
    if (this.type === 'select') {
      this.appendChild(this.select);
    } else {
      this.input.type = this.type;
      this.input.step = (this.type === 'number') ? 'any' : null;
      this.input.value = this.inputFormattedValue || null;
      this.appendChild(this.input);
    }
  }

  private setViewValue() {
    let viewValue = '';
    if (this.options && this.options.length) {
      const selected = this.options.find(x => x.id === this.value.toString());
      viewValue = selected ? selected.name : '';
    } else if (this.value instanceof Date) {
      if (this.type === 'date') {
        viewValue = this.value.toLocaleDateString();
      } else {
        const time = this.value.toLocaleTimeString();
        viewValue = this.value.toLocaleDateString() + ' ' + time;
      }
    } else {
      viewValue = this.value.toString();
    }
    this.inlineDataView.innerText = viewValue;
  }

  private firstInitValue() {
    if (!this.initValue) {
      this.input.value = this.inputFormattedValue || null;
      this.setSelectedIndex();
      this.initValue = true;
    }
  }

}

customElements.define('web-inline-edit', InlineEditComponent);
