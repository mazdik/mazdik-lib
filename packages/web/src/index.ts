import './styles/app.css';
import './styles/modal.component.css';
import '@mazdik-lib/modal';

async function bootstrap(main: HTMLElement) {
    if (location.pathname && location.pathname !== '/') {
      const module = await import(`./pages${location.pathname}.ts`);
      main.innerHTML = module.default;
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const main: HTMLElement = document.querySelector('main');
  const links: HTMLElement[] = Array.from(document.querySelectorAll('.sidenav > a'));

  bootstrap(main);

  links.forEach((link) => {
    link.addEventListener('click', async (e: MouseEvent) => {
        e.preventDefault();
        try {
          const module = await import(`./pages/${link.dataset.chunk}.ts`);
          history.replaceState({}, `${link.dataset.title}`, `/${link.dataset.chunk}`);
          main.innerHTML = module.default;
          module.page();
        } catch (error) {
          main.textContent = error.message;
        }
      });
  });

});
