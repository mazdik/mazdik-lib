import { Page } from '../page';
import '@mazdik-lib/dynamic-form';
import { DynamicFormComponent, DynamicFormElement } from '@mazdik-lib/dynamic-form';

export default class DropdownSelectDemo implements Page {

  get template(): string {
    return `<web-dynamic-form></web-dynamic-form>`;
  }

  load() {
    const dynElements: DynamicFormElement[] = [];

    const element = new DynamicFormElement();
    element.name = 'test';
    element.title = 'test title';
    element.item = {};
    dynElements.push(element);

    const component = document.querySelector('web-dynamic-form') as DynamicFormComponent;
    component.dynElements = dynElements;
  }

}
