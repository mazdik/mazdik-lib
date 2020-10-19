import { Page } from '../page';
import '@mazdik-lib/modal-edit-form';
import { ModalEditFormComponent } from '@mazdik-lib/modal-edit-form';
import { DynamicFormElement } from '@mazdik-lib/dynamic-form';
import { Validators } from '@mazdik-lib/common';

export default class ModalEditFormDemo implements Page {

  get template(): string {
    return `<web-modal-edit-form></web-modal-edit-form>
    <button class="dt-button" id="createButton">Create</button>&nbsp;
    <button class="dt-button" id="updateButton">Edit</button>&nbsp;
    <button class="dt-button" id="viewButton">View</button>
    `;
  }

  private dynElements: DynamicFormElement[] = [
    new DynamicFormElement({
      title: 'Multiple Select',
      name: 'multiple_select',
      type: 'select-dropdown',
      options: [
        { id: '1', name: 'CLERIC' },
        { id: '2', name: 'RANGER' },
        { id: '3', name: 'WARRIOR' },
        { id: '4', name: 'GLADIATOR' },
        { id: '5', name: 'SCOUT' },
        { id: '6', name: 'MAGE' },
        { id: '7', name: 'TEMPLAR' },
        { id: '8', name: 'SORCERER' },
        { id: '9', name: 'ASSASSIN' },
      ],
      multiple: true
    }),
    new DynamicFormElement({
      title: 'Name',
      name: 'name',
      validatorFunc: Validators.get({ required: true, minLength: 2, pattern: '^[a-zA-Z ]+$' }),
    }),
    new DynamicFormElement({
      title: 'Race',
      name: 'race',
      type: 'select',
      options: [
        { id: 'ASMODIANS', name: 'ASMODIANS' },
        { id: 'ELYOS', name: 'ELYOS' },
      ],
      validatorFunc: Validators.get({ required: true }),
    }),
    new DynamicFormElement({
      title: 'Cascading Select',
      name: 'note',
      type: 'select-dropdown',
      getOptionsFunc: this.getOptions,
      optionsUrl: 'assets/options.json',
      dependsElement: 'race',
    }),
    new DynamicFormElement({
      title: 'Gender',
      name: 'gender',
      type: 'radio',
      options: [
        { id: 'MALE', name: 'MALE' },
        { id: 'FEMALE', name: 'FEMALE' },
      ],
    }),
    new DynamicFormElement({
      title: 'Exp',
      name: 'exp',
      type: 'number',
      validatorFunc: Validators.get({ required: true, maxLength: 10, pattern: '^[0-9]+$' }),
    }),
    new DynamicFormElement({
      title: 'Last online',
      name: 'last_online',
      type: 'datetime-local',
    }),
    new DynamicFormElement({
      title: 'Account name',
      name: 'account_name',
      type: 'select-modal',
      getOptionsFunc: this.getOptions,
      optionsUrl: 'assets/accounts.json',
      keyElement: 'account_id',
    }),
    new DynamicFormElement({
      title: 'Account id',
      name: 'account_id'
    }),
    new DynamicFormElement({
      title: 'Player class',
      name: 'player_class',
      validatorFunc: this.customValidation,
    }),
    new DynamicFormElement({
      title: 'Online',
      name: 'online',
      type: 'checkbox',
      options: [
        { id: '1', name: 'Online' }
      ]
    }),
    new DynamicFormElement({
      title: 'Comment',
      name: 'comment',
      type: 'textarea',
    }),
  ];

  private item: any = {
    'multiple_select': ['4'],
    'name': 'Defunct',
    'race': 'ASMODIANS',
    'note': 'ASM2',
    'gender': 'MALE',
    'exp': 7734770,
    'last_online': '2013-04-14T22:51:14',
    'account_name': 'berserk',
    'account_id': 19,
    'player_class': 'CLERIC',
    'online': 1,
    'comment': 'test comment',
  };

  load() {
    const component = document.querySelector('web-modal-edit-form') as ModalEditFormComponent;
    component.dynElements = this.dynElements;
    component.item = this.item;
    component.saveMessage = 'Save!';
    component.closeMessage = 'Close!';
    component.addEventListener('create', (event: CustomEvent) => {
      console.log(event.detail);
    });
    component.addEventListener('update', (event: CustomEvent) => {
      console.log(event.detail);
    });

    const createButton = document.querySelector('#createButton');
    createButton.addEventListener('click', () => {
      component.modalTitle = 'Create new item';
      component.create();
    });
    const updateButton = document.querySelector('#updateButton');
    updateButton.addEventListener('click', () => {
      component.modalTitle = 'Edit item';
      component.update();
    });
    const viewButton = document.querySelector('#viewButton');
    viewButton.addEventListener('click', () => {
      component.modalTitle = 'View item';
      component.view();
    });
  }

  private customValidation(name: string, value: any): string[] {
    return (value == null || value.length === 0) ? ['Custom validator ' + name] : [];
  }

  private getOptions(url: string, parentId: any): Promise<any> {
    return fetch(url)
      .then(res => res.json())
      .then(res => {
        const result = res.filter((value: any) => {
          return value.parentId === parentId;
        });
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 1000);
        });
      });
  }

}
