import html from './dropdown.html';
import { Dropdown } from '@mazdik-lib/dropdown';

export default html;

export function page() {

  const list = document.querySelectorAll('.dropdown-directive-demo .dropdown');
  const dropdown = new Dropdown(list);

}
