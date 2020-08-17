import { Page } from '../page';
import '@mazdik-lib/data-table';
import { DataTableComponent, Settings, DataTable } from '@mazdik-lib/data-table';
import { getColumnsPlayers, getColumnsRank, getColumnsInventory } from '../shared/columns';

export default class DtMasterDetailDemo implements Page {

  get template(): string {
    return `<web-data-table id="dtPlayers" class="data-table-demo"></web-data-table>
    <div style="display:flex;">
      <div style="width: 59%;">
        <web-data-table id="dtInventory"></web-data-table>
      </div>
      <div style="width: 1%;"></div>
      <div style="width: 40%;">
        <web-data-table id="dtRank"></web-data-table>
      </div>
    </div>
    `;
  }

  private dtPlayers: DataTable;
  private dtInventory: DataTable;
  private dtRank: DataTable;
  private rank: any = [];
  private inventory: any = [];

  load() {
    this.createTablePlayers();
    this.loadRows();
    this.dtPlayers.events.element.addEventListener('selection', () => this.masterChanged());
    this.createTableInventory();
    this.createTableRank();
  }

  private createTablePlayers() {
    const columns = getColumnsPlayers();
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
    this.dtPlayers.events.onLoading(true);
    fetch('assets/players.json')
      .then(res => res.json())
      .then(data => {
        this.dtPlayers.rows = data;
        this.dtPlayers.events.onLoading(false);

        const masterId = this.dtPlayers.rows[0]['id'];
        this.dtPlayers.selectRow(0);

        fetch('assets/rank.json')
          .then(res => res.json())
          .then(data => {
            this.rank = data;
            this.dtRank.rows = this.rank.filter(x => x['player_id'] === masterId);
          });
        fetch('assets/inventory.json')
          .then(res => res.json())
          .then(data => {
            this.inventory = data;
            this.dtInventory.rows = this.inventory.filter(x => x['itemOwner'] === masterId);
          });
      });
  }

  private masterChanged() {
    const selection = this.dtPlayers.selection.getSelection();
    if (this.dtPlayers.rows.length > 0 && selection.length !== 0 && this.dtPlayers.rows[selection[0]]) {
      const masterId = this.dtPlayers.rows[selection[0]]['id'];
      this.dtRank.rows = this.rank.filter(x => x['player_id'] === masterId);
      this.dtInventory.rows = this.inventory.filter(x => x['itemOwner'] === masterId);
    } else {
      this.dtRank.rows = [];
      this.dtInventory.rows = [];
    }
  }

}
