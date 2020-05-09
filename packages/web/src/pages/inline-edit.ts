import { Page } from '../page';
import html from './inline-edit.html';
import '@mazdik-lib/inline-edit';
import { InlineEditComponent } from '@mazdik-lib/inline-edit';
import { SelectItem } from '@mazdik-lib/common';

export default class InlineEditDemo implements Page {

  get template(): string { return html; }

  load() {
    this.demo1();
    this.demo2();
    this.demo3();
  }

  private demo1() {
    const inlineEdit = document.querySelector('#inline-edit1') as InlineEditComponent;
    inlineEdit.value = 'string';
    inlineEdit.viewValue = 'string';
    inlineEdit.editing = false;
    inlineEdit.type = 'text';

    const button = document.querySelector('#button1') as HTMLButtonElement
    button.addEventListener('click', () => {
      inlineEdit.editing = !inlineEdit.editing;
      button.innerText = inlineEdit.editing ? 'View' : 'Edit';
    });
  }

  private demo2() {
    const inlineEdit = document.querySelector('#inline-edit2') as InlineEditComponent;
    inlineEdit.value = 2;
    inlineEdit.editing = false;
    inlineEdit.type = 'number';

    const options: SelectItem[] = [
      {id: '1', name: 'Select 1'},
      {id: '2', name: 'Select 2'},
      {id: '3', name: 'Select 3'},
      {id: '4', name: 'Select 4'},
      {id: '5', name: 'Select 5'},
      {id: '6', name: 'Select 6'},
    ];
    inlineEdit.selectPlaceholder = 'placeholder';
    inlineEdit.options = options;
    inlineEdit.viewValue = options.find(x => x.id === inlineEdit.value.toString()).name;

    const button = document.querySelector('#button2') as HTMLButtonElement
    button.addEventListener('click', () => {
      inlineEdit.editing = !inlineEdit.editing;
      button.innerText = inlineEdit.editing ? 'View' : 'Edit';
    });
  }

  private demo3() {
    const inlineEdit = document.querySelector('#inline-edit3') as InlineEditComponent;
    inlineEdit.value = new Date();
    inlineEdit.viewValue = inlineEdit.value.toString();
    inlineEdit.editing = false;
    inlineEdit.type = 'date';

    const button = document.querySelector('#button3') as HTMLButtonElement
    button.addEventListener('click', () => {
      inlineEdit.editing = !inlineEdit.editing;
      button.innerText = inlineEdit.editing ? 'View' : 'Edit';
    });
  }

}
