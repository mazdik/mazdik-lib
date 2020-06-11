import {
  SelectItem, Listener, inputFormattedDate, inputIsDateType, checkStrDate, isBlank
} from '@mazdik-lib/common';

export class InlineEditComponent extends HTMLElement {

  selectPlaceholder: string = '';
  type: string = 'text';

  get editing(): boolean { return this._editing; }
  set editing(val: boolean) {
    this._editing = val;
    this.renderInput();
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
    this.loadSelect();
    this.setViewValue();
  }
  private _options: SelectItem[];

  get isDateType(): boolean {
    return inputIsDateType(this.type);
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
    this.append(this.inlineDataView);

    this.select = document.createElement('select');
    this.input = document.createElement('input');

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

  private appendInput() {
    if (this.type === 'select') {
      this.append(this.select);
      this.select.focus();
    } else {
      this.input.type = this.type;
      if (this.type === 'number') {
        this.input.step = 'any';
      }
      this.input.value = this.getInputFormattedValue();
      this.append(this.input);
      this.input.focus();
    }
  }

  private removeInput() {
    if (this.contains(this.input)) {
      this.input = this.removeChild(this.input);
    }
    if (this.contains(this.select)) {
      this.select = this.removeChild(this.select);
    }
  }

  private renderInput() {
    if (this.editing) {
      this.inlineDataView.style.display = 'none';
      this.appendInput();
    } else {
      this.inlineDataView.style.display = 'block';
      this.removeInput();
    }
  }

  private firstInitValue() {
    if (!this.initValue) {
      this.input.value = this.getInputFormattedValue();
      this.setSelectedIndex();
      this.initValue = true;
    }
  }

  private loadSelect() {
    const defaultOption = new Option(this.selectPlaceholder, '', false, true);
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    this.select.options.add(defaultOption);

    for (const option of this.options) {
      this.select.options.add(new Option(option.name, option.id));
    }
    this.setSelectedIndex();
  }

  private setSelectedIndex() {
    if (this.options && this.options.length) {
      let index = this.options.findIndex(x => x.id === this.value.toString());
      index = (index >= 0) ? index + 1 : index; // + 1 selectPlaceholder
      this.select.selectedIndex = index;
    }
  }

  private getInputFormattedValue() {
    const val = this.isDateType ? inputFormattedDate(this.type, this.value) : this.value;
    return !isBlank(val) ? val : null;
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

}

customElements.define('web-inline-edit', InlineEditComponent);
