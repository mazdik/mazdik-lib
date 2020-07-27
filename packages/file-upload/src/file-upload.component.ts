import { Listener } from '@mazdik-lib/common';

export class FileUploadComponent extends HTMLElement {

  private input: HTMLInputElement;
  private content: HTMLElement;
  private mock: HTMLElement;

  private listeners: Listener[] = [];
  private isInitialized: boolean;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    this.classList.add('file-upload');

    const label = document.createElement('label');
    label.classList.add('file-upload-label');
    this.append(label);

    this.input = document.createElement('input');
    this.input.classList.add('file-upload-input');
    this.input.type = 'file';
    this.input.name = 'file';
    this.input.multiple = true;
    label.append(this.input);

    this.content = document.createElement('div');
    this.content.classList.add('file-upload-content');
    label.append(this.content);

    this.mock = document.createElement('div');
    this.mock.classList.add('file-upload-content-mock');
    this.mock.textContent = '+';
    this.content.append(this.mock);

    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'change',
        target: this.input,
        handler: this.onChangeInput.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private onChangeInput() {
    this.content.innerHTML = '';
    const files: File[] = [];
    const fileList = this.input.files;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      const element = document.createElement('div');
      element.classList.add('file-upload-row');
      element.textContent = file.name + ' ' + this.formatFileSize(file.size);
      this.content.append(element);
      files.push(file);
    }
    if (fileList.length <= 0) {
      this.content.append(this.mock);
    }
    this.dispatchEvent(new CustomEvent('fileUpload', { detail: files }));
  }

  private formatFileSize(size: number): string {
    const mb = Math.ceil(size / 1024);
    return mb.toLocaleString() + ' KB';
  }

}

customElements.define('web-file-upload', FileUploadComponent);
