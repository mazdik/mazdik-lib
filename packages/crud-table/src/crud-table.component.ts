import { Listener, MenuItem } from '@mazdik-lib/common';
import { DataManager } from './base/data-manager';
import '@mazdik-lib/data-table';
import '@mazdik-lib/dt-toolbar';
import '@mazdik-lib/context-menu';
import '@mazdik-lib/modal-edit-form';
import {
  DataTableComponent, HeaderActionRenderer, ColumnModelGenerator, Row, EventHelper, TemplateContext
} from '@mazdik-lib/data-table';
import { DtToolbarComponent } from '@mazdik-lib/dt-toolbar';
import { CellActionRenderer } from './cell-action-renderer';
import { ContextMenuComponent, MenuEventArgs } from '@mazdik-lib/context-menu';
import { ModalEditFormComponent, DynamicFormElement, KeyValuePair } from '@mazdik-lib/modal-edit-form';

export class CrudTableComponent extends HTMLElement {

  get dataManager(): DataManager { return this._dataManager; }
  set dataManager(val: DataManager) {
    this._dataManager = val;
    this.initLoad();
    this.addEventListeners();
  }
  private _dataManager: DataManager;

  private listeners: Listener[] = [];
  private isInitialized: boolean;
  private dt: DataTableComponent;
  private toolbar: DtToolbarComponent;
  private rowMenu: ContextMenuComponent;
  private modalEditForm: ModalEditFormComponent;
  private actionMenu: MenuItem[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    this.classList.add('datatable-wrapper');
    this.toolbar = document.createElement('web-dt-toolbar') as DtToolbarComponent;
    this.append(this.toolbar);
    this.dt = document.createElement('web-data-table') as DataTableComponent;
    this.append(this.dt);
    this.rowMenu = document.createElement('web-context-menu') as ContextMenuComponent;
    this.append(this.rowMenu);
    this.modalEditForm = document.createElement('web-modal-edit-form') as ModalEditFormComponent;
    this.append(this.modalEditForm);
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'filter',
        target: this.dataManager.events.element,
        handler: this.onFilter.bind(this)
      },
      {
        eventName: 'sort',
        target: this.dataManager.events.element,
        handler: this.onSort.bind(this)
      },
      {
        eventName: 'page',
        target: this.dataManager.events.element,
        handler: this.onPage.bind(this)
      },
      {
        eventName: 'scroll',
        target: this.dataManager.events.element,
        handler: this.onScroll.bind(this)
      },
      {
        eventName: 'create',
        target: this.modalEditForm,
        handler: this.onCreate.bind(this)
      },
      {
        eventName: 'update',
        target: this.modalEditForm,
        handler: this.onUpdate.bind(this)
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

  private initLoad() {
    const actionColumn = this.dataManager.columns.find(x => x.name === ColumnModelGenerator.actionColumn.name);
    if (actionColumn) {
      actionColumn.cellTemplate = new CellActionRenderer(this.onRowMenuClick.bind(this));
      actionColumn.headerCellTemplate = new HeaderActionRenderer();
    }
    this.dt.table = this.dataManager;

    this.initRowMenu();
    this.rowMenu.menu = this.actionMenu;

    if (this.dataManager.settings.initLoad) {
      this.dataManager.loadItems();
    }
    this.toolbar.table = this.dataManager;
    this.toolbar.globalFilter = this.dataManager.settings.globalFilter;

    this.modalEditForm.dynElements = this.createDynamicFormElements();
    this.modalEditForm.saveMessage = this.dataManager.messages.save;
    this.modalEditForm.closeMessage = this.dataManager.messages.close;
  }

  private onFilter() {
    this.dataManager.pager.current = 1;
    if (this.dataManager.settings.virtualScroll) {
      this.dt.setOffsetY(0);
      this.dataManager.pagerCache = {};
      this.dataManager.clear();
    }
    this.dataManager.loadItems();
  }

  private onSort() {
    if (this.dataManager.settings.virtualScroll) {
      this.dt.setOffsetY(0);
      this.dataManager.pager.current = 1;
      this.dataManager.pagerCache = {};
      this.dataManager.clear();
    }
    this.dataManager.loadItems();
  }

  private onPage() {
    this.dataManager.loadItems();
  }

  private onScroll() {
    this.rowMenu.hide();
  }

  private onRowMenuClick(context: TemplateContext, event: MouseEvent) {
    const { cell } = context;
    const row = cell.row;
    const { left, top } = EventHelper.getRowPosition(event, this.dataManager.settings.virtualScroll);
    this.rowMenuBeforeOpen(row);
    this.rowMenu.show({ originalEvent: event, data: row, left, top } as MenuEventArgs);
  }

  private rowMenuBeforeOpen(row: Row) {
    const rowChanged = this.dataManager.rowChanged(row);
    let menuIndex = this.actionMenu.findIndex(x => x.id === this.dataManager.messages.revertChanges);
    if (menuIndex > -1) {
      this.actionMenu[menuIndex].disabled = !rowChanged;
    }
    menuIndex = this.actionMenu.findIndex(x => x.id === this.dataManager.messages.save);
    if (menuIndex > -1) {
      const rowIsValid = this.dataManager.rowIsValid(row);
      this.actionMenu[menuIndex].disabled = !rowChanged || !rowIsValid;
    }
  }

  private initRowMenu() {
    if (this.dataManager.settings.singleRowView) {
      this.actionMenu.push(
        {
          id: this.dataManager.messages.titleDetailView,
          label: this.dataManager.messages.titleDetailView,
          icon: ['dt-icon', 'dt-icon-rightwards'],
          command: (row) => this.viewAction(row),
        }
      );
    }
    if (this.dataManager.settings.crud) {
      this.actionMenu.push(
        {
          id: this.dataManager.messages.titleUpdate,
          label: this.dataManager.messages.titleUpdate,
          icon: ['dt-icon', 'dt-icon-pencil'],
          command: (row) => this.updateAction(row),
        },
        {
          id: this.dataManager.messages.refresh,
          label: this.dataManager.messages.refresh,
          icon: ['dt-icon', 'dt-icon-refresh'],
          command: (row) => this.dataManager.refreshRow(row),
        },
        {
          id: this.dataManager.messages.revertChanges,
          label: this.dataManager.messages.revertChanges,
          icon: ['dt-icon', 'dt-icon-return'],
          command: (row) => this.dataManager.revertRowChanges(row),
          disabled: true,
        },
        {
          id: this.dataManager.messages.save,
          label: this.dataManager.messages.save,
          icon: ['dt-icon', 'dt-icon-ok'],
          command: (row) => this.dataManager.update(row),
          disabled: true,
        },
        {
          id: this.dataManager.messages.delete,
          label: this.dataManager.messages.delete,
          icon: ['dt-icon', 'dt-icon-remove'],
          command: (row) => confirm('Delete ?') ? this.dataManager.delete(row) : null,
        },
        {
          id: this.dataManager.messages.duplicate,
          label: this.dataManager.messages.duplicate,
          icon: ['dt-icon', 'dt-icon-plus'],
          command: (row) => this.duplicateAction(row),
        },
      );
    }
  }

  createAction() {
    this.dataManager.item = new Row({});
    this.modalEditForm.item = this.dataManager.item;
    this.modalEditForm.modalTitle = this.dataManager.messages.titleCreate;
    this.modalEditForm.create();
  }

  viewAction(row: Row) {
    this.dataManager.item = row;
    this.modalEditForm.item = this.dataManager.item;
    this.modalEditForm.modalTitle = this.dataManager.messages.titleDetailView;
    this.modalEditForm.view();
  }

  updateAction(row: Row) {
    this.dataManager.item = row;
    this.modalEditForm.item = this.dataManager.item;
    this.modalEditForm.modalTitle = this.dataManager.messages.titleUpdate;
    this.modalEditForm.update();
  }

  duplicateAction(row: Row) {
    this.dataManager.item = row.clone();
    this.modalEditForm.item = this.dataManager.item;
    this.modalEditForm.modalTitle = this.dataManager.messages.titleCreate;
    this.modalEditForm.update();
  }

  private onCreate(event: CustomEvent) {
    console.log(event.detail);
  }

  private onUpdate(event: CustomEvent) {
    console.log(event.detail);
  }

  private createDynamicFormElements(): DynamicFormElement[] {
    return this.dataManager.columns.map(column => {
      return new DynamicFormElement({
        name: column.name,
        title: column.title,
        options: column.options,
        optionsUrl: column.optionsUrl,
        type: column.type,
        validatorFunc: column.validatorFunc,
        dependsElement: column.dependsColumn,
        cellTemplate: column.formTemplate ? column.formTemplate : column.cellTemplate,
        hidden: column.formHidden,
        keyElement: column.keyColumn,
        disableOnEdit: column.formDisableOnEdit,
      });
    });
  }

}

customElements.define('web-crud-table', CrudTableComponent);
