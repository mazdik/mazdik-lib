import { Page } from '../page';
import '@mazdik-lib/dropdown-select';
import { DropdownSelectComponent } from '@mazdik-lib/dropdown-select';
import { SelectItem } from '@mazdik-lib/common';;

export default class DropdownSelectDemo implements Page {

  get template(): string {
    return `<div class="dropdown-select-demo">
    <web-dropdown-select class="sl-column" id="dropdown-select-demo1"></web-dropdown-select>
    <web-dropdown-select class="sl-column" id="dropdown-select-demo2"></web-dropdown-select>
  </div>`;
  }

  load() {
    const dropdownSelect1 = document.querySelector('#dropdown-select-demo1') as DropdownSelectComponent;
    const dropdownSelect2 = document.querySelector('#dropdown-select-demo2') as DropdownSelectComponent;

    const options: SelectItem[] = [
      { id: '1', name: 'Select 1' },
      { id: '2', name: 'Select 2' },
      { id: '3', name: 'Select 3' },
      { id: '4', name: 'Select 4' },
      { id: '5', name: 'Select 5' },
      { id: '6', name: 'Select 6' },
    ];

    dropdownSelect1.settings = {
      multiple: true
    };
    dropdownSelect1.options = options;
    dropdownSelect1.value = ['2', '4'];

    dropdownSelect2.options = options;
    dropdownSelect2.value = ['3'];
  }

}
