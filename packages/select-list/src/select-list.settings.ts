export class SelectListSettings {
  multiple?: boolean = false;
  selectAllMessage?: string = 'Select all';
  cancelMessage?: string = 'Cancel';
  clearMessage?: string = 'Clear';
  searchMessage?: string = 'Search...';
  enableSelectAll?: boolean = true;
  enableFilterInput?: boolean = true;

  constructor(init?: Partial<SelectListSettings>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
