import './styles/app.css';
import './styles/all.css';
import '@mazdik-lib/modal';
import { Header } from './header';
import { Page } from './page';

class App {

  currentPage: Page = null;
  indexPageTitle: string = document.title;
  header: Header;
  main: HTMLElement;

  constructor() {
    this.header = new Header();
    this.main = document.querySelector('main');
    const links: HTMLElement[] = Array.from(document.querySelectorAll('.body-nav > a'));

    const page = location.hash.slice(1) || 'modal-basic';
    this.setPage(page, '');

    links.forEach((link) => {
      link.addEventListener('click', async (e: MouseEvent) => {
          e.preventDefault();
          this.destroy(this.currentPage);
          this.setPage(link.dataset.chunk, link.innerText);
        });
    });
  }

  async setPage(name: string, title: string) {
    try {
      const module = await import(`./pages/${name}.ts`);
      history.replaceState({}, `${title}`, `/#${name}`);
      this.currentPage = new module.default;
      this.main.innerHTML = this.currentPage.template;
      this.currentPage.load();
      document.title = title ? title + ' - ' + this.indexPageTitle : this.indexPageTitle;
      this.header.state = name;
    } catch (error) {
      this.main.textContent = error.message;
    }
  }

  destroy(page: Page) {
    if (page && typeof page.onDestroy === "function") {
      page.onDestroy();
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
