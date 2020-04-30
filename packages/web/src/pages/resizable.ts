import html from './resizable.html';
import { Resizable } from '@mazdik-lib/resizable';

export default html;

export function page() {

  const box = document.querySelector('#box1') as HTMLElement;
  this.resizableDirective = new Resizable(box, true, true, true);
  this.resizableDirective.addEventListeners();

}
