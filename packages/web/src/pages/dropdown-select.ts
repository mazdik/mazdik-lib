import '@mazdik-lib/dropdown-select';
import { DropdownSelectComponent, SelectItem } from '@mazdik-lib/dropdown-select';
import html from './dropdown-select.html';

export default html;

export function page() {
  const dropdownSelect1 = document.querySelector('#dropdown-select-demo1') as DropdownSelectComponent;
  const dropdownSelect2 = document.querySelector('#dropdown-select-demo2') as DropdownSelectComponent;

  const options: SelectItem[] = [
    {id: '1', name: 'Select 1'},
    {id: '2', name: 'Select 2'},
    {id: '3', name: 'Select 3'},
    {id: '4', name: 'Select 4'},
    {id: '5', name: 'Select 5'},
    {id: '6', name: 'Select 6'},
  ];

  dropdownSelect1.settings = {
    multiple: true
  };
  dropdownSelect1.options = options;
  dropdownSelect1.value = ['2', '4'];

  dropdownSelect2.options = options;
  dropdownSelect2.value = ['3'];
}
