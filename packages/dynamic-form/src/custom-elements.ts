import { InputComponent } from './input.component';
import { SelectComponent } from './select.component';
import { TextareaComponent } from './textarea.component';
import { CheckboxRadioComponent } from './checkbox-radio.component';
import { SelectDropdownComponent } from './select-dropdown.component';
import { SelectModalComponent } from './select-modal.component';

export const componentNames = [
  { type: 'input', name: 'web-form-input' },
  { type: 'select', name: 'web-form-select' },
  { type: 'textarea', name: 'web-form-textarea' },
  { type: 'checkbox', name: 'web-form-checkbox-radio' },
  { type: 'radio', name: 'web-form-checkbox-radio' },
  { type: 'select-dropdown', name: 'web-form-select-dropdown' },
  { type: 'select-modal', name: 'web-form-select-modal' },
];

const elements = [
  { name: 'web-form-input', model: InputComponent },
  { name: 'web-form-select', model: SelectComponent },
  { name: 'web-form-textarea', model: TextareaComponent },
  { name: 'web-form-checkbox-radio', model: CheckboxRadioComponent },
  { name: 'web-form-select-dropdown', model: SelectDropdownComponent },
  { name: 'web-form-select-modal', model: SelectModalComponent },
];

elements.forEach(x => {
  customElements.define(x.name, x.model);
});
