import './styles/app.css';
import './styles/all.css';
import '@mazdik-lib/modal';
import { Header } from './header';

async function setPage(main: HTMLElement, name: string, title: string) {
  try {
    const module = await import(`./pages/${name}.ts`);
    history.replaceState({}, `${title}`, `/#${name}`);
    main.innerHTML = module.default;
    module.page();
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
        setPage(main, link.dataset.chunk, link.innerText);
        header.state = link.dataset.chunk;
      });
  });

});
