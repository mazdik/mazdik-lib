import { Page } from '../page';
import '@mazdik-lib/file-upload';
import { FileUploadComponent } from '@mazdik-lib/file-upload';

export default class FileUploadDemo implements Page {

  get template(): string {
    return `<web-file-upload class="file-upload-demo"></web-file-upload>`;
  }

  load() {
    const component = document.querySelector('web-file-upload') as FileUploadComponent;
    component.addEventListener('fileUpload', (event: CustomEvent<File[]>) => {
      console.log(event.detail);
    });
  }

}
