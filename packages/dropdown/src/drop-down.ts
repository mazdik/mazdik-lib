import { Keys } from '@mazdik-lib/common';

export class DropDown {

  isOpen: boolean;
  selectContainerClicked: boolean;

  private clickListener: any;
  private windowClickListener: any;
  private windowKeydownListener: any;

  constructor(private element: HTMLElement) {
    this.addEventListeners();
  }

  private addEventListeners() {
    this.clickListener = this.onClick.bind(this);
    this.element.addEventListener('click', this.clickListener);

    this.windowClickListener = this.onWindowClick.bind(this);
    window.document.addEventListener('click', this.windowClickListener);

    this.windowKeydownListener = this.onKeyDown.bind(this);
    window.document.addEventListener('keydown', this.windowKeydownListener);
  }

  removeEventListeners() {
    this.element.removeEventListener('click', this.clickListener);
    window.document.removeEventListener('click', this.windowClickListener);
    window.document.removeEventListener('keydown', this.windowKeydownListener);
  }

  onClick(): void {
    this.selectContainerClicked = true;
  }

  onWindowClick(): void {
    if (!this.selectContainerClicked) {
      this.closeDropdown();
    }
    this.selectContainerClicked = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === Keys.ESCAPE || event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  openDropdown() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.element.dispatchEvent(new CustomEvent('open', { detail: this.isOpen }));
    }
  }

  closeDropdown() {
    if (this.isOpen) {
      this.isOpen = false;
      this.element.dispatchEvent(new CustomEvent('open', { detail: this.isOpen }))
    }
  }

}
