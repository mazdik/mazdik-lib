import { DataManager } from './base/data-manager';
import { DynamicFormElement, KeyValuePair } from '@mazdik-lib/modal-edit-form';

export class CrudTableHelper {

  static createDynamicFormElements(dataManager: DataManager): DynamicFormElement[] {
    return dataManager.columns.map(column => {
      return new DynamicFormElement({
        title: column.title,
        name: column.name,
        options: column.options,
        optionsUrl: column.optionsUrl,
        type: column.type,
        validatorFunc: column.validatorFunc,
        dependsElement: column.dependsColumn,
        cellTemplate: column.formTemplate ? column.formTemplate : column.cellTemplate,
        hidden: column.formHidden,
        keyElement: column.keyColumn,
        disableOnEdit: column.formDisableOnEdit,
        getOptionsFunc: dataManager.service.getOptions.bind(dataManager.service),
        selectPlaceholder: dataManager.messages.selectPlaceholder,
        searchInputPlaceholder: dataManager.messages.search,
      });
    });
  }

  static getRowViewData(dataManager: DataManager): KeyValuePair[] {
    return dataManager.columns.map(column => {
      return { key: column.title, value: column.getValueView(dataManager.item) };
    });
  }

}
