import { Page } from '../page';
import html from './pagination.html';
import '@mazdik-lib/pagination';
import { PaginationComponent } from '@mazdik-lib/pagination';

export default class PaginationDemo implements Page {

  get template(): string { return html; }

  load() {
    const component = document.querySelector('web-pagination') as PaginationComponent;
    component.totalItems = 100;
    component.perPage = 10;
    component.currentPage = 1;
    component.pageSizeOptions = [10, 20, 30, 50];

    component.addEventListener('pageChanged', (event: CustomEvent) => {
     console.log(event.detail);
    });
  }

}
