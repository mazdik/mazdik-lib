import { ColumnMenuEventArgs, CellEventArgs, CellEventType } from './types';

export class Events {

  element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
  }

  emitSort() {
    this.element.dispatchEvent(new CustomEvent('sort'));
  }

  emitFilter() {
    this.element.dispatchEvent(new CustomEvent('filter'));
  }

  emitSelectionChange() {
    this.element.dispatchEvent(new CustomEvent('selection'));
  }

  emitPage() {
    this.element.dispatchEvent(new CustomEvent('page'));
  }

  emitColumnMenuClick(data: ColumnMenuEventArgs) {
    this.element.dispatchEvent(new CustomEvent('columnMenu', { detail: data }));
  }

  emitResizeBegin() {
    this.element.dispatchEvent(new CustomEvent('resizeBegin'));
  }

  emitResize(data: any) {
    this.element.dispatchEvent(new CustomEvent('resize', { detail: data }));
  }

  emitResizeEnd() {
    this.element.dispatchEvent(new CustomEvent('resizeEnd'));
  }

  emitRowsChanged() {
    this.element.dispatchEvent(new CustomEvent('rowsChanged'));
  }

  emitScroll(data: any) {
    this.element.dispatchEvent(new CustomEvent('scroll', { detail: data }));
  }

  emitLoading(data: boolean) {
    this.element.dispatchEvent(new CustomEvent('loading', { detail: data }));
  }

  emitCheckbox(data: any) {
    this.element.dispatchEvent(new CustomEvent('checkbox', { detail: data }));
  }

  emitCell(data: CellEventArgs) {
    this.element.dispatchEvent(new CustomEvent('cell', { detail: data }));
  }

  // emitMouseover(data: CellEventArgs) {
  //   data.type = CellEventType.Mouseover;
  //   this.emitCell(data);
  // }

  // emitMouseout(data: CellEventArgs) {
  //   data.type = CellEventType.Mouseout;
  //   this.emitCell(data);
  // }

  emitActivateCell(data: CellEventArgs) {
    data.type = CellEventType.Activate;
    this.emitCell(data);
  }

  emitClickCell(data: CellEventArgs) {
    data.type = CellEventType.Click;
    this.emitCell(data);
  }

  emitDblClickCell(data: CellEventArgs) {
    data.type = CellEventType.DblClick;
    this.emitCell(data);
  }

  emitKeydownCell(data: CellEventArgs) {
    data.type = CellEventType.Keydown;
    this.emitCell(data);
  }

  // emitContextMenu(data: CellEventArgs) {
  //   data.type = CellEventType.ContextMenu;
  //   this.emitCell(data);
  // }

  emitCellEditMode(data: CellEventArgs) {
    data.type = CellEventType.EditMode;
    this.emitCell(data);
  }

  emitCellValueChanged(data: CellEventArgs) {
    data.type = CellEventType.ValueChanged;
    this.emitCell(data);
  }

  emitUpdateStyles() {
    this.element.dispatchEvent(new CustomEvent('updateStyles'));
  }

}
