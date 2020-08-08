import { Page } from '../page';
import { VirtualScroller } from '@mazdik-lib/scroller';

export default class ScrollerDemo implements Page {

  get template(): string {
    return `<div class="scroller-demo"><div class="scroller-demo-content"></div></div>`;
  }

  load() {
    const items = Array.from({length: 5000}).map((x, i) => {
      const element = document.createElement('div');
      element.textContent = `Item #${i+1}`
      return element;
    });

    const scrollElement = document.querySelector('.scroller-demo') as HTMLElement;
    const contentElement = document.querySelector('.scroller-demo-content') as HTMLElement;

    const virtualScroller = new VirtualScroller(scrollElement, contentElement, 40, 20);
    scrollElement.addEventListener('viewRowsChange', (event: CustomEvent<HTMLElement[]>) => {
      contentElement.innerHTML = '';
      contentElement.append(...event.detail);
    });
    virtualScroller.items = items;
  }

}
