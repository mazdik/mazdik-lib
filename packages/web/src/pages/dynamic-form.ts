import { Page } from '../page';
import '@mazdik-lib/dynamic-form';
import { DynamicFormComponent, DynamicFormElement } from '@mazdik-lib/dynamic-form';
import { Validators } from '@mazdik-lib/common';

export default class DropdownSelectDemo implements Page {

  get template(): string {
    return `<web-dynamic-form></web-dynamic-form>`;
  }

  load() {
    const dynElements: DynamicFormElement[] = [
      new DynamicFormElement({
        title: 'Id',
        name: 'id',
        type: 'number',
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
        type: 'select-popup',
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
    ];

    const component = document.querySelector('web-dynamic-form') as DynamicFormComponent;
    component.dynElements = dynElements;
  }

  private customValidation(name: string, value: any): string[] {
    const errors = [];
    if (value == null || value.length === 0) {
      errors.push('Custom validator ' + name);
    }
    return errors;
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
