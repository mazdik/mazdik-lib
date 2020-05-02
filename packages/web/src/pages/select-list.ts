import '@mazdik-lib/select-list';
import { SelectListComponent } from '@mazdik-lib/select-list';
import { SelectItem } from '@mazdik-lib/common';
import html from './select-list.html';

export default html;

export function page() {
  const selectList1 = document.querySelector('#select-list-demo1') as SelectListComponent;
  const selectList2 = document.querySelector('#select-list-demo2') as SelectListComponent;

  const options: SelectItem[] = [
    {id: '1', name: 'Select 1'},
    {id: '2', name: 'Select 2'},
    {id: '3', name: 'Select 3'},
    {id: '4', name: 'Select 4'},
    {id: '5', name: 'Select 5'},
    {id: '6', name: 'Select 6'},
  ];

  selectList1.settings = {
    multiple: true
  };
  selectList1.options = options;
  selectList1.model = ['2', '4'];

  selectList2.options = options;
  selectList2.model = ['3'];
}
