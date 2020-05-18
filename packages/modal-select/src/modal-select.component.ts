import { SelectItem, arrayPaginate } from '@mazdik-lib/common';
import { ModalComponent } from '@mazdik-lib/modal';
import { PageEvent } from '@mazdik-lib/pagination';

export class ModalSelectComponent extends HTMLElement {

  filterDelay: number = 300;
  disabled: boolean;
  modalTitle: string = 'Search Dialog';
  itemsPerPage: number = 10;
  placeholder: string = 'Select';
  searchInputPlaceholder: string = 'Search...';

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    if (this._options) {
      this.optionsCopy = [...val];
      this.selectedName = this.getName();
      this.dispatchEvent(new CustomEvent('nameChanged', { detail: this.selectedName }));
    }
  }
  private _options: SelectItem[];

  get model() { return this._model; }
  set model(value) {
    if (this._model !== value) {
      this._model = value;
      this.selectedName = this.getName();
      this.dispatchEvent(new CustomEvent('valueChange', { detail: this._model }));
      this.dispatchEvent(new CustomEvent('nameChanged', { detail: this.selectedName }));
    }
  }
  private _model: any;

  private modal: ModalComponent;

  searchFilterText: string = null;
  currentPage: number = 1;
  sortOrder: number = 1;
  totalItems: number;
  filterTimeout: any;
  selectedName: string;

  private optionsCopy: SelectItem[] = [];

  constructor() {
    super();
    this.classList.add('dt-modal-select');
  }

  open() {
    if (!this.disabled) {
      this.searchFilterText = '';
      this.modal.show();
      this._options = this.getOptions();
    }
  }

  onFilterKeyup() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this._options = this.getOptions();
      this.filterTimeout = null;
    }, this.filterDelay);
  }

  getOptions() {
    let data = [];
    if (this.optionsCopy && this.optionsCopy.length && this.searchFilterText) {
      data = this.optionsCopy.filter(x => x.name.toLocaleLowerCase().indexOf(this.searchFilterText.toLocaleLowerCase()) > -1);
      this.currentPage = 1;
    } else {
      data = this.optionsCopy;
    }
    this.totalItems = data.length;
    const result = arrayPaginate(data, this.currentPage, this.itemsPerPage);
    return result;
  }

  onPageChanged(event: PageEvent) {
    this.currentPage = event.currentPage;
    this.itemsPerPage = event.perPage;
    this._options = this.getOptions();
  }

  setSelected(option: SelectItem) {
    this.model = option.id;
    this.modal.hide();
  }

  isSelected(option: SelectItem): boolean {
    return option.id === this.model;
  }

  getName() {
    if (this.optionsCopy) {
      const option = this.optionsCopy.find((x) => {
        return x.id === this.model;
      });
      return (option) ? option.name : '';
    }
  }

  onClickClearSearch() {
    this.searchFilterText = '';
    this.onFilterKeyup();
  }

}

customElements.define('web-modal-select', ModalSelectComponent);
