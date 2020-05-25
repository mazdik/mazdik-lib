import { SelectItem, arrayPaginate, Listener, toggleClass } from '@mazdik-lib/common';
import '@mazdik-lib/modal';
import { ModalComponent } from '@mazdik-lib/modal';
import '@mazdik-lib/pagination';
import { PageEvent, PaginationComponent } from '@mazdik-lib/pagination';

function getTemplate(id: string) {
  return `
  <div class="dt-input-group" id="inputGroup${id}">
    <input class="dt-input dt-select-input" id="selectInput${id}" readonly="readonly">
    <button class="dt-button dt-white">
      <i class="dt-icon dt-icon-return"></i>
    </button>
  </div>
  <web-modal>
    <template select="app-modal-header">
      <span id="modalSelectTitle${id}">Modal</span>
    </template>
    <template select="app-modal-body">
      <div class="dt-select-header">
        <div class="dt-clearable-input">
          <input class="dt-input select-input" id="filterInput${id}">
          <span id="clearSearchIcon${id}">&times;</span>
        </div>
      </div>
      <ul class="dt-list-menu" id="selectList${id}"></ul>
    </template>
    <template select="app-modal-footer">
      <web-pagination></web-pagination>
    </ng-container>
    </template>
  </web-modal>
  `;
}

export class ModalSelectComponent extends HTMLElement {

  filterDelay: number = 300;
  itemsPerPage: number = 10;
  modalTitle: string = 'Search Dialog';
  placeholder: string = 'Select';
  searchInputPlaceholder: string = 'Search...';

  get disabled() { return this._disabled; }
  set disabled(val: boolean) {
    this._disabled = val;
    this.selectInput.disabled = val;
    const button = this.selectInput.nextElementSibling as HTMLButtonElement;
    button.disabled = val;
  }
  private _disabled: boolean;

  get options(): SelectItem[] { return this._options; }
  set options(val: SelectItem[]) {
    this._options = val;
    if (this._options) {
      this.optionsCopy = [...val];
      this.setSelectedName();
    }
  }
  private _options: SelectItem[];

  get model(): string { return this._model; }
  set model(value: string) {
    if (this._model !== value) {
      this._model = value;
      this.dispatchEvent(new CustomEvent('valueChange', { detail: this._model }));
      this.setSelectedName();
    }
  }
  private _model: string;

  private modal: ModalComponent;
  private pagination: PaginationComponent;

  private currentPage: number = 1;
  private totalItems: number;
  private filterTimeout: any;

  private optionsCopy: SelectItem[] = [];
  private listeners: Listener[] = [];

  private inputGroup: HTMLElement;
  private selectInput: HTMLInputElement;
  private filterInput: HTMLInputElement;
  private selectList: HTMLElement;
  private clearSearchIcon: HTMLElement;
  private modalSelectTitle: HTMLElement;
  private selectListElements: HTMLElement[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.onInit();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    const id = (~~(Math.random()*1e3)).toString();
    const template = document.createElement('template');
    template.innerHTML = getTemplate(id);
    this.appendChild(template.content.cloneNode(true));

    this.classList.add('dt-modal-select');
    this.inputGroup = this.querySelector('#inputGroup'+id);
    this.selectInput = this.querySelector('#selectInput'+id);
    this.filterInput = this.querySelector('#filterInput'+id);
    this.selectList = this.querySelector('#selectList'+id);
    this.clearSearchIcon = this.querySelector('#clearSearchIcon'+id);
    this.modalSelectTitle = this.querySelector('#modalSelectTitle'+id);
    this.modal = this.querySelector('web-modal');
    this.pagination = this.querySelector('web-pagination');

    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.inputGroup,
        handler: this.onClickInputGroup.bind(this)
      },
      {
        eventName: 'click',
        target: this.selectList,
        handler: this.onClickList.bind(this)
      },
      {
        eventName: 'click',
        target: this.clearSearchIcon,
        handler: this.onClickClearSearch.bind(this)
      },
      {
        eventName: 'input',
        target: this.filterInput,
        handler: this.onInputFilter.bind(this)
      },
      {
        eventName: 'pageChanged',
        target: this.pagination,
        handler: this.onPageChanged.bind(this)
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

  private getOptions() {
    const searchFilterText = this.filterInput.value;
    let data = [];
    if (this.optionsCopy && this.optionsCopy.length && searchFilterText) {
      data = this.optionsCopy.filter(x => x.name.toLocaleLowerCase().indexOf(searchFilterText.toLocaleLowerCase()) > -1);
      this.currentPage = 1;
    } else {
      data = this.optionsCopy;
    }
    this.totalItems = data.length;
    const result = arrayPaginate(data, this.currentPage, this.itemsPerPage);
    return result;
  }

  private createListContent(items: SelectItem[]): HTMLElement[] {
    const elements = [];
    items.forEach(item => {
      const element = document.createElement('div');
      element.classList.add('dt-list-menu-item');
      element.textContent = item.name;
      element.dataset.id = item.id;
      elements.push(element);
    });
    return elements;
  }

  private renderListContent() {
    const options = this.getOptions();
    this.selectListElements = this.createListContent(options);
    this.selectList.innerHTML = '';
    this.selectList.append(...this.selectListElements);
  }

  private getListItemElement(event: MouseEvent): HTMLElement {
    const target = event.target as HTMLElement;
    const element = target.classList.contains('dt-list-menu-item') ? target : target.closest('.dt-list-menu-item') as HTMLElement;
    return element;
  }

  private setSelectedName() {
    const option = (this.optionsCopy || []).find(x => x.id === this.model);
    const selectedName = (option) ? option.name : '';
    this.selectInput.value = selectedName;
  }

  private updateStyles() {
    this.selectListElements.forEach(element => {
      toggleClass(element, 'active', element.dataset.id === this.model);
    });
    this.clearSearchIcon.style.display = this.filterInput.value.length > 0 ? 'block' : 'none';
  }

  private onClickInputGroup() {
    if (!this.disabled) {
      this.filterInput.value = '';
      this.modalSelectTitle.textContent = this.modalTitle;
      this.selectInput.placeholder = this.placeholder;
      this.filterInput.placeholder = this.searchInputPlaceholder;
      this.renderListContent();
      this.updateStyles();
      this.modal.show();
      this.pagination.totalItems = this.totalItems;
      this.pagination.perPage = this.itemsPerPage;
      this.pagination.currentPage = this.currentPage;
    }
  }

  private onClickList(event: MouseEvent) {
    const element = this.getListItemElement(event);
    if (!element) {
      return;
    }
    event.stopPropagation();
    this.model = element.dataset.id;
    this.modal.hide();
    this.updateStyles();
  }

  private onInputFilter() {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this.renderListContent();
      this.filterTimeout = null;
    }, this.filterDelay);
    this.updateStyles();
  }

  private onPageChanged(event: CustomEvent<PageEvent>) {
    this.currentPage = event.detail.currentPage;
    this.itemsPerPage = event.detail.perPage;
    this.renderListContent();
    this.updateStyles();
  }

  private onClickClearSearch() {
    this.filterInput.value = '';
    this.renderListContent();
    this.updateStyles();
  }

}

customElements.define('web-modal-select', ModalSelectComponent);
