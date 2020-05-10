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
    inlineEdit.type = 'text';
    inlineEdit.value = 'string';

    const button = document.querySelector('#button1') as HTMLButtonElement
    button.addEventListener('click', () => {
      inlineEdit.editing = !inlineEdit.editing;
      button.innerText = inlineEdit.editing ? 'View' : 'Edit';
    });

    inlineEdit.addEventListener('valueChange', (event: CustomEvent) => {
      console.log(event.detail);
    });
  }

  private demo2() {
    const inlineEdit = document.querySelector('#inline-edit2') as InlineEditComponent;
    inlineEdit.type = 'select';
    inlineEdit.value = 2;

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

    const button = document.querySelector('#button2') as HTMLButtonElement
    button.addEventListener('click', () => {
      inlineEdit.editing = !inlineEdit.editing;
      button.innerText = inlineEdit.editing ? 'View' : 'Edit';
    });

    inlineEdit.addEventListener('valueChange', (event: CustomEvent) => {
      console.log(event.detail);
    });
  }

  private demo3() {
    const inlineEdit = document.querySelector('#inline-edit3') as InlineEditComponent;
    inlineEdit.type = 'date';
    inlineEdit.value = new Date();

    const button = document.querySelector('#button3') as HTMLButtonElement
    button.addEventListener('click', () => {
      inlineEdit.editing = !inlineEdit.editing;
      button.innerText = inlineEdit.editing ? 'View' : 'Edit';
    });

    inlineEdit.addEventListener('valueChange', (event: CustomEvent) => {
      console.log(event.detail);
    });
  }

}
