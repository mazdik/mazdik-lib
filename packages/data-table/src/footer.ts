import { DataTable } from './base';

export class Footer {

  element: HTMLElement;
  resizeHelper: HTMLElement;

  constructor(private table: DataTable) {
    this.element = document.createElement('div');
    this.element.classList.add('datatable-footer');

    this.resizeHelper = document.createElement('div');
    this.resizeHelper.classList.add('column-resizer-helper');
  }

}
