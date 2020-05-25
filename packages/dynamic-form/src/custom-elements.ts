import { InputComponent } from './input.component';
import { SelectComponent } from './select.component';
import { TextareaComponent } from './textarea.component';
import { CheckboxComponent } from './checkbox.component';
import { RadioComponent } from './radio.component';
import { SelectDropdownComponent } from './select-dropdown.component';
import { SelectModalComponent } from './select-modal.component';

export const componentNames = [
  { type: 'input', name: 'web-form-input', model: InputComponent },
  { type: 'select', name: 'web-form-select', model: SelectComponent },
  { type: 'textarea', name: 'web-form-textarea', model: TextareaComponent },
  { type: 'checkbox', name: 'web-form-checkbox', model: CheckboxComponent },
  { type: 'radio', name: 'web-form-radio', model: RadioComponent },
  { type: 'select-dropdown', name: 'web-form-select-dropdown', model: SelectDropdownComponent },
  { type: 'select-modal', name: 'web-form-select-modal', model: SelectModalComponent },
];

componentNames.forEach(x => {
  customElements.define(x.name, x.model);
});
