import { Page } from '../page';
import '@mazdik-lib/pagination';
import { PaginationComponent } from '@mazdik-lib/pagination';

export default class PaginationDemo implements Page {

  get template(): string {
    return `<web-pagination class="pagination-demo"></web-pagination>`;
  }

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
