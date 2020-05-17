import { Page } from '../page';
import '@mazdik-lib/row-view';
import { RowViewComponent, KeyValuePair } from '@mazdik-lib/row-view';

export default class RowViewDemo implements Page {

  get template(): string {
    return '<web-row-view class="row-view-demo"></web-row-view>';
  }

  load() {
    const component = document.querySelector('web-row-view') as RowViewComponent;
    component.data = this.getData();
  }

  private getData(): KeyValuePair[] {
    const item = {
      'id': 96491,
      'name': 'Defunct',
      'account_id': 19,
      'account_name': 'berserk',
      'exp': 7734770,
      'recoverexp': 0,
      'x': 1024.99,
      'y': 2534.94,
      'z': 228.821,
      'heading': 17,
      'world_id': 220020000,
      'gender': 'MALE',
      'race': 'ASMODIANS',
      'player_class': 'CLERIC',
      'creation_date': '2013-04-14T14:49',
      'last_online': '2013-04-14T22:51:14',
      'cube_size': 0,
      'advanced_stigma_slot_size': 0,
      'warehouse_size': 0,
      'mailboxLetters': 0,
      'mailboxUnReadLetters': 0,
      'brokerKinah': 0,
      'bind_point': 31,
      'title_id': -1,
      'online': 1
    };
    const result: KeyValuePair[] = [];
    Object.keys(item).forEach(key => {
      result.push({key, value: item[key]});
    });
    return result;
  }

}
