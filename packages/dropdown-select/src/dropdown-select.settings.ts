import { SelectListSettings } from '@mazdik-lib/select-list';

export class DropdownSelectSettings extends SelectListSettings {
  placeholder?: string = 'Select';
  selectedMessage?: string = 'Selected';
  disabled?: boolean = false;

  constructor(init?: Partial<DropdownSelectSettings>) {
    super(init);
    if (init) {
      Object.assign(this, init);
    }
  }
}
