import { Listener, inputFormattedDate, getLastDate, LastDateType, SelectItem } from '@mazdik-lib/common';
import { DataTable, Column, FilterOperator } from '../base';

export class RangeFilter {

  element: HTMLElement;

  private column: Column;
  private listeners: Listener[] = [];

  private matchMode: string;
  private value: any;
  private valueTo: any;
  private operators: SelectItem[];
  private defaultMatchMode = FilterOperator.EQUALS;

  private select: HTMLSelectElement;
  private input: HTMLInputElement;
  private inputTo: HTMLInputElement;
  private listMenu: HTMLElement;
  private okButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;
  private clearButton: HTMLButtonElement;

  private get isValueFilter() {
    return !this.table.dataFilter.isNonValueFilter(this.matchMode);
  }
  private get isRangeFilter() {
    return this.matchMode === FilterOperator.IN_RANGE;
  }

  constructor(private table: DataTable) {
    this.operators = [
      { id: FilterOperator.EQUALS, name: this.table.messages.equals },
      { id: FilterOperator.NOT_EQUAL, name: this.table.messages.notEqual },
      { id: FilterOperator.GREATER_THAN, name: this.table.messages.greaterThan },
      { id: FilterOperator.GREATER_THAN_OR_EQUAL, name: this.table.messages.greaterThanOrEqual },
      { id: FilterOperator.LESS_THAN, name: this.table.messages.lessThan },
      { id: FilterOperator.LESS_THAN_OR_EQUAL, name: this.table.messages.lessThanOrEqual },
      { id: FilterOperator.IN_RANGE, name: this.table.messages.inRange },
      { id: FilterOperator.IS_EMPTY, name: this.table.messages.isEmpty },
      { id: FilterOperator.IS_NOT_EMPTY, name: this.table.messages.isNotEmpty },
    ];

    this.element = document.createElement('div');

    this.select = document.createElement('select');
    this.select.classList.add('dt-input', 'sm', 'dt-form-group');
    this.element.append(this.select);

    this.input = document.createElement('input');
    this.input.classList.add('dt-input', 'dt-form-group');
    this.element.append(this.input);

    this.inputTo = document.createElement('input');
    this.inputTo.classList.add('dt-input', 'dt-form-group');
    this.element.append(this.inputTo);

    this.listMenu = document.createElement('ul');
    this.listMenu.classList.add('dt-list-menu');
    this.element.append(this.listMenu);

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
        eventName: 'input',
        target: this.inputTo,
        handler: this.onInputTo.bind(this)
      },
      {
        eventName: 'click',
        target: this.listMenu,
        handler: this.onClickListMenu.bind(this)
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
    this.valueTo = this.table.dataFilter.getFilterValueTo(this.column.name);
    this.render();
    this.setFocus();
    this.setSelectedIndex();
  }

  private saveFilter() {
    this.table.dataFilter.setFilter(this.value, this.column.name, this.matchMode, this.valueTo, this.column.dataType);
    this.table.events.onFilter();
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
      this.valueTo = null;
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
    this.valueTo = null;
    this.matchMode = this.defaultMatchMode;
    this.saveFilter();
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

  private render() {
    this.input.type = this.column.type;
    this.input.placeholder = this.isRangeFilter ? '>' : this.column.name;
    this.input.value = this.value;
    this.input.style.display = this.isValueFilter ? 'block' : 'none';

    this.inputTo.type = this.column.type;
    this.inputTo.placeholder = '<';
    this.inputTo.value = this.valueTo;
    this.inputTo.style.display = this.isRangeFilter ? 'block' : 'none';

    this.okButton.style.display = this.isValueFilter ? 'block' : 'none';
    this.listMenu.innerHTML = '';
    if (this.column.isDateType) {
      const items: SelectItem[] = [
        { id: 'year', name: 'lastYear' },
        { id: 'month', name: 'lastMonth' },
        { id: 'day', name: 'lastDay' },
        { id: 'hour', name: 'lastHour' },
      ];
      const elements = this.createListMenuElements(items);
      this.listMenu.append(...elements);
    }
  }

  private createListMenuElements(items: SelectItem[]): HTMLElement[] {
    const elements = [];
    items.forEach(x => {
      const element = document.createElement('li');
      element.classList.add('dt-list-menu-item');
      element.textContent = this.table.messages[x.name];
      element.dataset.id = x.id;
      elements.push(element);
    });
    return elements;
  }

  private onInput(event: any) {
    this.value = event.target.value;
  }

  private onInputTo(event: any) {
    this.valueTo = event.target.value;
  }

  private onClickListMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const el = target.tagName === 'LI' ? target : target.closest('li');
    if (el && el.dataset.id) {
      event.stopPropagation();
      this.lastDate(el.dataset.id as LastDateType);
    }
  }

  private lastDate(name: LastDateType) {
    this.matchMode = FilterOperator.GREATER_THAN_OR_EQUAL;
    this.value = inputFormattedDate(this.column.type, getLastDate(name).toISOString());
    this.saveFilter();
    this.element.dispatchEvent(new CustomEvent('filterClose', { detail: true }));
  }

}
