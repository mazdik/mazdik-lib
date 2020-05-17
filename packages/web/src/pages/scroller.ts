import { Page } from '../page';
import '@mazdik-lib/scroller';
import { ScrollerComponent } from '@mazdik-lib/scroller';
import html from './scroller.html';

export default class SelectListDemo implements Page {

  get template(): string { return html; }

  load() {
    const items = Array.from({length: 5000}).map((x, i) => {
      const element = document.createElement('div');
      element.textContent = `Item #${i+1}`
      return element;
    });

    const scroller = document.querySelector('web-scroller') as ScrollerComponent;
    scroller.style.height = 500 + 'px';
    scroller.rowHeight = 40;
    scroller.itemsPerRow = 20;
    scroller.items = items;
  }

}
