import { Listener, SelectItem, Keys } from '@mazdik-lib/common';
import { DataTable, Column, FilterOperator } from '../base';

export class StringFilter {

  element: HTMLElement;

  private column: Column;
  private listeners: Listener[] = [];

  private matchMode: string;
  private value: any;
  private operators: SelectItem[];
  private defaultMatchMode = FilterOperator.STARTS_WITH;

  private select: HTMLSelectElement;
  private input: HTMLInputElement;

  private okButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;
  private clearButton: HTMLButtonElement;

  private get isValueFilter() {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
  }

  constructor(private table: DataTable) {
    this.operators = [
      {id: FilterOperator.EQUALS, name: this.table.messages.equals},
      {id: FilterOperator.NOT_EQUAL, name: this.table.messages.notEqual},
      {id: FilterOperator.STARTS_WITH, name: this.table.messages.startsWith},
      {id: FilterOperator.ENDS_WITH, name: this.table.messages.endsWith},
      {id: FilterOperator.CONTAINS, name: this.table.messages.contains},
      {id: FilterOperator.NOT_CONTAINS, name: this.table.messages.notContains},
      {id: FilterOperator.IS_EMPTY, name: this.table.messages.isEmpty},
      {id: FilterOperator.IS_NOT_EMPTY, name: this.table.messages.isNotEmpty},
    ];

    this.element = document.createElement('div');

    this.select = document.createElement('select');
    this.select.classList.add('dt-input', 'sm', 'dt-form-group');
    this.element.append(this.select);

    this.input = document.createElement('input');
    this.input.classList.add('dt-input', 'dt-form-group');
    this.element.append(this.input);

    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.classList.add('dt-list-menu-row');
    this.element.append(buttonsWrapper);

    this.okButton = document.createElement('button');
    this.okButton.classList.add('dt-button', 'dt-button-sm');
    this.okButton.innerText = this.table.messages.ok;
    buttonsWrapper.append(this.okButton);

    this.cancelButton = document.createElement('button');
    this.cancelButton.classList.add('dt-button', 'dt-button-sm');
    this.cancelButton.innerText = this.table.messages.cancel;
    buttonsWrapper.append(this.cancelButton);

    this.clearButton = document.createElement('button');
    this.clearButton.classList.add('dt-button', 'dt-button-sm');
    this.clearButton.innerText = this.table.messages.clear;
    buttonsWrapper.append(this.clearButton);

    this.loadSelect();
    this.addEventListeners();
  }

  destroy() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'change',
        target: this.select,
        handler: this.onChangeSelect.bind(this)
      },
      {
        eventName: 'input',
        target: this.input,
        handler: this.onInput.bind(this)
      },
      {
        eventName: 'keypress',
        target: this.input,
        handler: this.onKeyPressFilterInput.bind(this)
      },
      {
        eventName: 'click',
        target: this.okButton,
        handler: this.onClickOk.bind(this)
      },
      {
        eventName: 'click',
        target: this.cancelButton,
        handler: this.onClickCancel.bind(this)
      },
      {
        eventName: 'click',
        target: this.clearButton,
        handler: this.onClickClear.bind(this)
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

  onOpenChange(column: Column) {
    this.column = column;
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.defaultMatchMode;
    this.value = this.table.dataFilter.getFilterValue(this.column.name);
    this.render();
    this.setFocus();
    this.setSelectedIndex();
  }

  private saveFilter() {
    this.table.dataFilter.setFilter(this.value, this.column.name, this.matchMode, null, this.column.dataType);
    this.table.events.emitFilter();
  }

  private setFocus() {
    if (this.input && this.isValueFilter) {
      setTimeout(() => {
        this.input.focus();
      }, 1);
    }
  }

  private loadSelect() {
    this.select.innerHTML = '';
    for (const option of this.operators) {
      this.select.options.add(new Option(option.name, option.id));
    }
    this.setSelectedIndex();
  }

  private setSelectedIndex() {
    if (this.operators && this.operators.length) {
      const index = this.operators.findIndex(x => x.id === this.matchMode);
      this.select.selectedIndex = index;
    }
  }

  private onChangeSelect(event: any) {
    this.matchMode = event.target.value;
    this.onModeChange();
    this.render();
  }

  private onModeChange() {
    if (!this.isValueFilter) {
      this.value = 0;
      this.saveFilter();
      this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
    } else if (this.value === 0) {
      this.value = null;
    }
  }

  private onClickOk() {
    this.saveFilter();
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private onClickCancel() {
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private onClickClear() {
    this.value = null;
    this.matchMode = this.defaultMatchMode;
    this.saveFilter();
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private render() {
    this.input.type = 'text';
    this.input.placeholder = this.column.name;
    this.input.value = this.value;
    this.input.style.display = this.isValueFilter ? 'block' : 'none';

    this.okButton.style.display = this.isValueFilter ? 'block' : 'none';
  }

  private onInput(event: any) {
    this.value = event.target.value;
  }

  private onKeyPressFilterInput(event: KeyboardEvent) {
    if (event.which === Keys.ENTER) {
      this.onClickOk();
    }
  }

}
