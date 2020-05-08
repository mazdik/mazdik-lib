import {
  SelectItem, Listener, inputFormattedDate, inputIsDateType, checkStrDate, isBlank
} from '@mazdik-lib/common';

function getTemplate(id: string) {
  return `
  <div class="dt-inline-data" id="inlineDataView${id}" *ngIf="!editing">
    {{viewValue}}
  </div>
  <select
    *ngIf="editing && options"
    appAfterViewFocus
    (change)="onInput($event); onInputChange()"
    (focus)="onInputFocus()"
    (blur)="onInputBlur()">
    <option value="" disabled selected hidden>{{selectPlaceholder}}</option>
    <option *ngFor="let opt of options" [value]="opt.id" [selected]="(opt.id === value)">{{opt.name}}</option>
  </select>
  <input *ngIf="editing && !options"
          appAfterViewFocus
          [value]="inputFormattedValue || null"
          (input)="onInput($event)"
          (keyup)="onInputChange()"
          (focus)="onInputFocus()"
          (blur)="onInputBlur()"/>
  `;
}

export class InlineEditComponent extends HTMLElement {

  type = 'text';
  selectPlaceholder: string;
  value: string | number | Date;
  editing: boolean;
  options: SelectItem[];
  viewValue: string | number | Date;

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
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-inline-editor');

    this.inlineDataView = this.querySelector('#inlineDataView');
    this.select = this.querySelector('select');
    this.input = this.querySelector('input');

    this.input.type = this.type;
    this.input.step = (this.type === 'number') ? 'any' : null;

    this.addEventListeners();
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

  onInputChange() {
    this.dispatchEvent(new CustomEvent('inputChange'));
  }

  onInputFocus() {
    this.dispatchEvent(new CustomEvent('focusChange'));
  }

  onInputBlur() {
    this.dispatchEvent(new CustomEvent('blurChange'));
  }

}

customElements.define('web-inline-edit', InlineEditComponent);
