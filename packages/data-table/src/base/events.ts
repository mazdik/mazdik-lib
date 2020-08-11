import { ColumnMenuEventArgs, CellEventArgs, CellEventType } from './types';

export class Events {

  element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
  }

  onSort() {
    this.element.dispatchEvent(new CustomEvent('sort'));
  }

  onFilter() {
    this.element.dispatchEvent(new CustomEvent('filter'));
  }

  onSelectionChange() {
    this.element.dispatchEvent(new CustomEvent('selection'));
  }

  onPage() {
    this.element.dispatchEvent(new CustomEvent('page'));
  }

  onColumnMenuClick(data: ColumnMenuEventArgs) {
    this.element.dispatchEvent(new CustomEvent('columnMenu', { detail: data }));
  }

  onResizeBegin() {
    this.element.dispatchEvent(new CustomEvent('resizeBegin'));
  }

  onResize(data: any) {
    this.element.dispatchEvent(new CustomEvent('resize', { detail: data }));
  }

  onResizeEnd() {
    this.element.dispatchEvent(new CustomEvent('resizeEnd'));
  }

  onRowsChanged() {
    this.element.dispatchEvent(new CustomEvent('rowsChanged'));
  }

  onScroll(data: any) {
    this.element.dispatchEvent(new CustomEvent('scroll', { detail: data }));
  }

  onLoading(data: boolean) {
    this.element.dispatchEvent(new CustomEvent('loading', { detail: data }));
  }

  onCheckbox(data: any) {
    this.element.dispatchEvent(new CustomEvent('checkbox', { detail: data }));
  }

  onCell(data: CellEventArgs) {
    this.element.dispatchEvent(new CustomEvent('cell', { detail: data }));
  }

  onMouseover(data: CellEventArgs) {
    data.type = CellEventType.Mouseover;
    this.onCell(data);
  }

  onMouseout(data: CellEventArgs) {
    data.type = CellEventType.Mouseout;
    this.onCell(data);
  }

  onActivateCell(data: CellEventArgs) {
    data.type = CellEventType.Activate;
    this.onCell(data);
  }

  onClickCell(data: CellEventArgs) {
    data.type = CellEventType.Click;
    this.onCell(data);
  }

  onDblClickCell(data: CellEventArgs) {
    data.type = CellEventType.DblClick;
    this.onCell(data);
  }

  onKeydownCell(data: CellEventArgs) {
    data.type = CellEventType.Keydown;
    this.onCell(data);
  }

  onContextMenu(data: CellEventArgs) {
    data.type = CellEventType.ContextMenu;
    this.onCell(data);
  }

  onCellEditMode(data: CellEventArgs) {
    data.type = CellEventType.EditMode;
    this.onCell(data);
  }

  onCellValueChanged(data: CellEventArgs) {
    data.type = CellEventType.ValueChanged;
    this.onCell(data);
  }

}
