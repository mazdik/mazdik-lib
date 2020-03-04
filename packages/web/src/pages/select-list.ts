import { SelectListComponent } from '@mazdik-lib/select-list';
import html from './select-list.html';

export default html;

export function page() {
  const selectList = document.querySelector('#select-list') as SelectListComponent;
}
