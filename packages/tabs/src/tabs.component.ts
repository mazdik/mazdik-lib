import { SelectItem, Listener, isBlank } from '@mazdik-lib/common';

export class TabsComponent extends HTMLElement {

  get tabs() { return this._tabs; }
  set tabs(val: SelectItem[]) {
    this._tabs = val;
    this.render();
  }
  private _tabs: SelectItem[];

  localStorageName: string;

  private selected: string;
  private tabElements: HTMLElement[] = [];
  private listeners: Listener[] = [];

  constructor() {
    super();
    this.classList.add('dt-tab');
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this,
        handler: this.onClick.bind(this)
      }
    ];
    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private createTabs(tabs: SelectItem[]): HTMLElement[] {
    const tabElements: HTMLElement[] = [];
    tabs.forEach(tab => {
      const element = document.createElement('span');
      element.textContent = tab.name;
      element.dataset.id = tab.id;
      tabElements.push(element);
    });
    return tabElements;
  }

  private render() {
    this.tabElements = this.createTabs(this.tabs);
    this.innerHTML = '';
    this.append(...this.tabElements);
    this.initSelected();
    this.updateStyles();
  }

  private updateStyles() {
    this.tabElements.forEach(el => {
      if (this.selected === el.dataset.id) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  private initSelected() {
    if (this.localStorageName) {
      this.selected = localStorage.getItem(this.localStorageName);
      if (this.selected) {
        this.emitEvent();
      }
    }
    if (!this.selected && this.tabs && this.tabs.length) {
      this.selected = this.tabs[0].id;
      this.emitEvent();
    }
  }

  private onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const element = target.tagName === 'SPAN' ? target : target.closest('span') as HTMLElement;

    if (element && !isBlank(element.dataset.id)) {
      event.stopPropagation();
      this.onClickTab(element.dataset.id);
    }
  }

  private onClickTab(id: string) {
    this.selected = id;
    this.emitEvent();
    if (this.localStorageName) {
      localStorage.setItem(this.localStorageName, this.selected);
    }
    this.updateStyles();
  }

  private emitEvent() {
    this.dispatchEvent(new CustomEvent('selectTab', { detail: this.selected }));
  }

}

customElements.define('web-tabs', TabsComponent);
