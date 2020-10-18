import { Listener, toggleClass, SelectItem } from '@mazdik-lib/common';
import { TemplateRenderer, TemplateContext, Cell, CellEventType, CellEventArgs, EventHelper } from '@mazdik-lib/data-table';
import { SelectListComponent } from '@mazdik-lib/select-list';

export class CellMultiSelectRenderer implements TemplateRenderer {

  private elements = new Map<Cell, HTMLElement>();
  private inputs = new Map<Cell, HTMLInputElement>();
  private icons = new Map<Cell, HTMLElement>();
  private listeners: Listener[] = [];
  private editing = {};
  private selectedCell: Cell;

  private get isOpen(): boolean { return this._isOpen; }
  private set isOpen(val: boolean) {
    this._isOpen = val;
    this.selectList.isOpen = this.isOpen;
    this.updateStyleSelectList();
  }
  private _isOpen = false;

  constructor(private selectList: SelectListComponent, private options: SelectItem[]) {
    this.updateStyleSelectList();
    this.addListener({
      eventName: 'selectionChange',
      target: this.selectList,
      handler: this.onSelectionChange.bind(this)
    });
    this.addListener({
      eventName: 'selectionCancel',
      target: this.selectList,
      handler: this.onSelectionCancel.bind(this)
    });
  }

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
    this.inputs.set(cell, input);
    this.icons.set(cell, icon);
    this.refresh(context);

    return element;
  }

  destroy() {
    this.removeEventListeners();
    this.elements.forEach(x => x.remove());
    this.elements.clear();
  }

  refresh(context: TemplateContext) {
    const { cell } = context;
    const element = this.elements.get(cell);
    if (element) {
      const view = element.firstElementChild as HTMLElement;
      const inputGroup = element.lastElementChild as HTMLElement;
      toggleClass(view, 'display-none', this.editing[cell.rowIndex]);
      toggleClass(inputGroup, 'display-none', !this.editing[cell.rowIndex]);

      this.updateSelectedName(cell);
    }
    this.updateStyleSelectList();
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
    this.isOpen = false;
  }

  private onClick(context: TemplateContext, event: MouseEvent) {
    const { cell, table } = context;
    const icon = this.icons.get(cell);
    event.stopPropagation();
    this.isOpen = !this.isOpen;
    if (icon) {
      toggleClass(icon, 'asc', this.isOpen);
      toggleClass(icon, 'desc', !this.isOpen);
    }
    const pos = EventHelper.getRowPosition(event, table.settings.virtualScroll);
    this.selectList.model = cell.value || [];
    this.selectList.style.left = pos.left + 'px';
    this.selectList.style.top = pos.top + 'px';

    this.selectedCell = cell;
  }

  private updateSelectedName(cell: Cell) {
    const selectedName = this.getName(cell.value);
    const input = this.inputs.get(cell);
    input.value = selectedName;
  }

  private getName(items: any): string {
    if (items && items.length && this.options && this.options.length) {
      if (items.length > 1) {
        return items.length + ' items selected';
      } else {
        const option = this.options.find((x) => x.id === items[0]);
        return (option) ? option.name : '';
      }
    }
    return '';
  }

  private updateStyleSelectList() {
    this.selectList.style.display = this.isOpen ? 'block' : 'none';
  }

  private onSelectionChange(event: CustomEvent) {
    this.selectedCell.value = event.detail;
    this.updateSelectedName(this.selectedCell);
    this.isOpen = false;
  }

  private onSelectionCancel() {
    this.isOpen = false;
  }

}
