import { Page } from '../page';
import html from './dt-modal.html';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable, Cell } from '@mazdik-lib/data-table';
import { getColumnsPlayers, getColumnsRank, getColumnsInventory } from '../shared/columns';
import { ModalCellRenderer } from '../shared/modal-cell-renderer';
import { ModalComponent } from '@mazdik-lib/modal';

export default class DtModalDemo implements Page {

  get template(): string { return html; }

  private dtPlayers: DataTable;
  private dtInventory: DataTable;
  private dtRank: DataTable;
  private rank: any = [];
  private inventory: any = [];
  private rankModal: ModalComponent;
  private inventoryModal: ModalComponent;

  load() {
    this.rankModal = document.querySelector('#rankModal') as ModalComponent;
    this.inventoryModal = document.querySelector('#inventoryModal') as ModalComponent;
    this.createTablePlayers();
    this.createTableInventory();
    this.createTableRank();
    this.loadRows();
  }

  private createTablePlayers() {
    const columns = getColumnsPlayers();
    columns.splice(7);
    const modalCellRendererRank = new ModalCellRenderer(this.onClickCellRank.bind(this));
    const modalCellRendererInventory = new ModalCellRenderer(this.onClickCellInventory.bind(this));
    columns[0].cellTemplate = modalCellRendererRank;
    columns[1].cellTemplate = modalCellRendererInventory;

    this.dtPlayers = new DataTable(columns, new Settings());
    const component = document.querySelector('#dtPlayers') as DataTableComponent;
    component.table = this.dtPlayers;
  }

  private createTableInventory() {
    const columns = getColumnsInventory();
    this.dtInventory = new DataTable(columns, new Settings());
    const component = document.querySelector('#dtInventory') as DataTableComponent;
    component.table = this.dtInventory;
  }

  private createTableRank() {
    const columns = getColumnsRank();
    this.dtRank = new DataTable(columns, new Settings());
    const component = document.querySelector('#dtRank') as DataTableComponent;
    component.table = this.dtRank;
  }

  private loadRows() {
    this.dtPlayers.events.emitLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        this.dtPlayers.rows = data;
        this.dtPlayers.events.emitLoading(false);
      });
    fetch('assets/rank.json')
      .then(res => res.json())
      .then(data => {
        this.rank = data;
        this.dtRank.rows = this.rank;
      });
    fetch('assets/inventory.json')
      .then(res => res.json())
      .then(data => {
        this.inventory = data;
        this.dtInventory.rows = this.inventory;
      });
  }

  private onClickCellRank(cell: Cell) {
    this.dtRank.rows = this.rank.filter(x => x['player_id'] === cell.value);
    this.rankModal.show();
  }

  private onClickCellInventory(cell: Cell) {
    this.dtInventory.rows = this.inventory.filter(x => x['itemOwner'] === cell.row['id']);
    this.inventoryModal.show();
  }

}
