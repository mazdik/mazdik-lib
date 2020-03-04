import './styles/app.css';
import './styles/modal.component.css';
import '@mazdik-lib/modal';

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
  const main: HTMLElement = document.querySelector('main');
  const links: HTMLElement[] = Array.from(document.querySelectorAll('.sidenav > a'));

  setPage(main, location.hash.slice(1) || 'modal-basic', '');

  links.forEach((link) => {
    link.addEventListener('click', async (e: MouseEvent) => {
        e.preventDefault();
        setPage(main, link.dataset.chunk, link.innerText);
      });
  });

});
