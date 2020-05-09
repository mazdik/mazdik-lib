import {
  SelectItem, Listener, inputFormattedDate, inputIsDateType, checkStrDate, isBlank
} from '@mazdik-lib/common';

function getTemplate() {
  return `
  <div class="dt-inline-data"></div>
  <select
    *ngIf="options"
    (change)="onInput($event); onInputChange()"
    (focus)="onInputFocus()"
    (blur)="onInputBlur()">
    <option value="" disabled selected hidden>{{selectPlaceholder}}</option>
    <option *ngFor="let opt of options" [value]="opt.id" [selected]="(opt.id === value)">{{opt.name}}</option>
  </select>
  <input *ngIf="!options"
          (input)="onInput($event)"
          (keyup)="onInputChange()"
          (focus)="onInputFocus()"
          (blur)="onInputBlur()"/>
  `;
}

export class InlineEditComponent extends HTMLElement {

  type = 'text';
  selectPlaceholder: string;

  get editing(): boolean { return this._editing; }
  set editing(val: boolean) {
    this._editing = val;
    this.updateStyles();
    this.setFocus();
  }
  private _editing: boolean;

  set viewValue(val: string) {
    this.inlineDataView.innerText = val;
  }

  get value(): string | number | Date { return this._value; }
  set value(val: string | number | Date) {
    this._value = val;
    this.input.value = this.inputFormattedValue || null;
  }
  private _value: string | number | Date;

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
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

    this.input.type = this.type;
    this.input.step = (this.type === 'number') ? 'any' : null;

    this.addEventListeners();
    this.updateStyles();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
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

  removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  onInput(event: any) {
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

  onInputChange() {
    this.dispatchEvent(new CustomEvent('inputChange'));
  }

  onInputFocus() {
    this.dispatchEvent(new CustomEvent('focusChange'));
  }

  onInputBlur() {
    this.dispatchEvent(new CustomEvent('blurChange'));
  }

  private updateStyles() {
    if (this.editing) {
      this.inlineDataView.style.display = 'none';
      this.select.style.display = 'block';
      this.input.style.display = 'block';
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

}

customElements.define('web-inline-edit', InlineEditComponent);
