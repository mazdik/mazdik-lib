import { InputOptionComponent } from './input-option.component';
import '@mazdik-lib/modal-select';
import { ModalSelectComponent } from '@mazdik-lib/modal-select';

export class SelectModalComponent extends InputOptionComponent {

  private modalSelect: ModalSelectComponent;

  constructor() {
    super();
    this.modalSelect = document.createElement('web-modal-select') as ModalSelectComponent;
  }

  onInit() {
    super.onInit();
    this.label.after(this.modalSelect);

    window.customElements.whenDefined('web-modal-select').then(() => {
      this.modalSelect.title = this.dynElement.title;
      this.modalSelect.placeholder = this.dynElement.selectPlaceholder;
      this.modalSelect.searchInputPlaceholder = this.dynElement.searchInputPlaceholder;
      this.modalSelect.options = this.getOptions();
      this.modalSelect.model = this.value;
    });

    this.addEventListeners();
  }

  onDisabled(val: boolean) {
    super.onDisabled(val);
    // TODO
    //this.modalSelect.disabled = val;
  }

  onLoadOptions() {
    super.onLoadOptions();
    window.customElements.whenDefined('web-modal-select').then(() => {
      this.modalSelect.options = this.getOptions();
    });
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'valueChange',
        target: this.modalSelect,
        handler: this.onInput.bind(this)
      },
    ];
    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private onInput(event: CustomEvent) {
    this.value = event.detail;
    this.onValueChange();
  }

}
