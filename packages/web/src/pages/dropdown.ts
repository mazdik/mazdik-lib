import { Page } from '../page';
import html from './dropdown.html';
import { Dropdown } from '@mazdik-lib/dropdown';

export default class DropdownDemo implements Page {

  get template(): string { return html; }

  private dropdown: Dropdown;

  load() {
    const list: HTMLElement[] = Array.from(document.querySelectorAll('.dropdown-directive-demo .dropdown'));
    this.dropdown = new Dropdown(list);
  }

  onDestroy() {
    this.dropdown.destroy();
  }

}
