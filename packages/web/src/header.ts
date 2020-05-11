export class Header {

  set state(val: string) {
    this.updateSourceLink(val);
  }

  private navbarExpand: boolean = false;
  private mainNav: HTMLElement;
  private navbarToggle: HTMLElement;
  private sourceLink: HTMLAnchorElement;
  private githubIcon: HTMLAnchorElement;
  private link = 'https://github.com/mazdik/mazdik-lib';

  constructor() {
    this.mainNav = document.querySelector('#main-nav') as HTMLElement;
    this.navbarToggle = document.querySelector('#navbar-toggle') as HTMLElement;
    this.sourceLink = document.querySelector('#source-link') as HTMLAnchorElement;
    this.githubIcon = document.querySelector('#github-icon') as HTMLAnchorElement;

    this.sourceLink.href = this.link;
    this.githubIcon.href = this.link;

    this.navbarToggle.addEventListener('click', () => {
      this.navbarExpand = !this.navbarExpand;
      this.updateStyles();
    });
  }

  private updateStyles() {
    if (this.navbarExpand) {
      this.mainNav.classList.add('navbar-expand');
    } else {
      this.mainNav.classList.remove('navbar-expand');
    }
  }

  private updateSourceLink(state: string) {
    const link: string = this.link + '/blob/master/packages/web/src/pages/';
    this.sourceLink.href = (state) ? link + state + '.ts' : link;
  }

}
