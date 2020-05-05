import './styles/app.css';
import './styles/all.css';
import '@mazdik-lib/modal';
import { Header } from './header';
import { Page } from './page';

let currentPage: Page = null;
const indexPageTitle = document.title;

function destroy(page: Page) {
  if (page && typeof page.onDestroy === "function") {
    page.onDestroy();
  }
}

async function setPage(main: HTMLElement, name: string, title: string) {
  try {
    const module = await import(`./pages/${name}.ts`);
    history.replaceState({}, `${title}`, `/#${name}`);
    currentPage = new module.default;
    main.innerHTML = currentPage.template;
    currentPage.load();
    document.title = title ? title + ' - ' + indexPageTitle : indexPageTitle;
  } catch (error) {
    main.textContent = error.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const header = new Header();
  const main: HTMLElement = document.querySelector('main');
  const links: HTMLElement[] = Array.from(document.querySelectorAll('.body-nav > a'));

  const page = location.hash.slice(1) || 'modal-basic';
  setPage(main, page, '');
  header.state = page;

  links.forEach((link) => {
    link.addEventListener('click', async (e: MouseEvent) => {
        e.preventDefault();
        destroy(currentPage);
        setPage(main, link.dataset.chunk, link.innerText);
        header.state = link.dataset.chunk;
      });
  });

});
