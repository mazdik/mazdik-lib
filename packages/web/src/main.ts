import './styles/app.css';
import '@mazdik-lib/styles';
import '@mazdik-lib/modal';
import '@mazdik-lib/nav-menu';
import { NavMenuComponent } from '@mazdik-lib/nav-menu';
import { Header } from './header';
import { Page } from './page';
import { getNavMenuNodes } from './navigation';

class App {

  currentPage: Page = null;
  indexPageTitle: string = document.title;
  header: Header;
  main: HTMLElement;
  navMenu: NavMenuComponent;

  constructor() {
    this.header = new Header();
    this.main = document.querySelector('main');
    this.navMenu = document.querySelector('#nav-menu');
    this.navMenu.nodes = getNavMenuNodes();

    const page = location.hash.slice(1) || 'modal-basic';
    this.setPage(page, '');
    this.navMenu.ensureVisible(page);

    this.navMenu.addEventListener('linkClicked', (event: CustomEvent) => {
      this.destroy(this.currentPage);
      this.setPage(event.detail.id, event.detail.name);
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

  private destroy(page: Page) {
    if (page && typeof page.onDestroy === 'function') {
      page.onDestroy();
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
