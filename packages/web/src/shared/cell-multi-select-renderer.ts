import { Listener, toggleClass, SelectItem, isBlank } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell, CellEventType, CellEventArgs } from '@mazdik-lib/data-table';

export class CellMultiSelectRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];
  private editing = {};
  private isOpen = false;

  constructor(
    private onClickFunc: (event: Event, context: TemplateContext) => void,
    private options: SelectItem[]
  ) { }

  create(context: TemplateContext): HTMLElement {
    const { cell, table } = context;
    const element = document.createElement('div');
    element.classList.add('multi-select-cell');

    const view = document.createElement('span');
    view.classList.add('view-data');
    view.textContent = cell.viewValue;
    element.append(view);

    const inputGroup = document.createElement('div');
    inputGroup.classList.add('dt-input-group', 'display-none');
    element.append(inputGroup);

    const input = document.createElement('input');
    input.classList.add('dt-input', 'dt-select-input');
    input.readOnly = true;
    input.placeholder = 'Select';
    inputGroup.append(input);

    const button = document.createElement('button');
    button.classList.add('dt-button', 'dt-white');
    inputGroup.append(button);

    const icon = document.createElement('i');
    icon.classList.add('dt-icon', 'desc');
    button.append(icon);

    this.addListener({
      eventName: 'cell',
      target: table.events.element,
      handler: this.onCell.bind(this, context)
    });
    this.addListener({
      eventName: 'click',
      target: inputGroup,
      handler: this.onClick.bind(this, context)
    });

    this.elements.set(cell, element);
    this.refresh(context);
    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell, table } = context;
    const element = this.elements.get(cell);
    if (element) {
      const view = element.firstElementChild as HTMLElement;
      const inputGroup = element.lastElementChild as HTMLElement;
      toggleClass(view, 'display-none', this.editing[cell.rowIndex]);
      toggleClass(inputGroup, 'display-none', !this.editing[cell.rowIndex]);

      const selectedName = this.getName(table.rows[cell.rowIndex][cell.column.name]);
      const input = element.querySelector('input');
      if (!isBlank(selectedName)) {
        input.value = selectedName;
      }
    }
  }

  private addListener(listener: Listener) {
    this.listeners.push(listener);
    listener.target.addEventListener(listener.eventName, listener.handler);
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onCell(context: TemplateContext, event: CustomEvent<CellEventArgs>) {
    const data = event.detail;
    Object.keys(this.editing).forEach(x => this.editing[x] = false);
    if (data.type === CellEventType.Click && data.columnIndex === 3) {
      this.editing[data.rowIndex] = true;
    }
  }

  private onClick(context: TemplateContext, event: MouseEvent) {
    const { cell } = context;
    const element = this.elements.get(cell);
    if (element) {
      const icon = element.querySelector('button > i') as HTMLElement;
      toggleClass(icon, 'asc', this.isOpen);
      toggleClass(icon, 'desc', !this.isOpen);
    }
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  private getName(items: any) {
    if (items && items.length && this.options && this.options.length) {
      if (items.length > 1) {
        return items.length + ' items selected';
      } else {
        const option = this.options.find((x) => x.id === items[0]);
        return (option) ? option.name : '';
      }
    }
  }

}
