import { Page } from '../page';
import html from './dropdown.html';
import { Dropdown } from '@mazdik-lib/dropdown';

export default class DropdownDemo implements Page {

  get template(): string { return html; }

  load() {
    const list = document.querySelectorAll('.dropdown-directive-demo .dropdown');
    const dropdown = new Dropdown(list);
  }

  onDestroy() {
  }

}
