import { MenuEventArgs } from './types';
import { DropDown } from '@mazdik-lib/dropdown';
import { MenuItem, isBlank, Listener } from '@mazdik-lib/common';

export class ContextMenuComponent extends HTMLElement {

  get menu(): MenuItem[] { return this._menu; }
  set menu(val: MenuItem[]) {
    this._menu = val;
    this.render();
  }
  private _menu: MenuItem[] = [];

  private left: number;
  private top: number;
  private eventArgs: MenuEventArgs;
  private dropdown: DropDown;
  private listeners: Listener[] = [];
  private listMenu: HTMLElement;

  constructor() {
    super();
    this.listMenu = document.createElement('ul');
    this.append(this.listMenu);
    this.classList.add('dt-context-menu');
    this.dropdown = new DropDown(this);
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.dropdown.removeEventListeners();

    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'open',
        target: this,
        handler: this.onOpenChange.bind(this)
      },
      {
        eventName: 'resize',
        target: window,
        handler: this.onWindowResize.bind(this)
      },
      {
        eventName: 'click',
        target: this.listMenu,
        handler: this.onClickListMenu.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private onWindowResize(): void {
    this.dropdown.closeDropdown();
  }

  private getPositionMenu(left: number, top: number) {
    const {height, width} = this.getHiddenElementOuterSizes(this);
    // flip
    if (left + width - window.pageXOffset > window.innerWidth) {
      left -= width;
    }
    // flip
    if (top + height - window.pageYOffset > window.innerHeight) {
      top -= height;
    }
    // fit
    if (left < document.body.scrollLeft) {
      left = document.body.scrollLeft;
    }
    // fit
    if (top < document.body.scrollTop) {
      top = document.body.scrollTop;
    }
    return { left, top };
  }

  private getHiddenElementOuterSizes(element: HTMLElement) {
    if (element.offsetParent) {
      return { height: element.offsetHeight, width: element.offsetWidth };
    }
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight = element.offsetHeight;
    const elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return { height: elementHeight, width: elementWidth };
  }

  show(event: MenuEventArgs) {
    this.eventArgs = event;
    let coords;
    if (!isBlank(event.left) && !isBlank(event.top)) {
      coords = this.getPositionMenu(event.left, event.top);
      this.dropdown.selectContainerClicked = true;
    } else {
      coords = this.getPositionMenu(event.originalEvent.pageX + 1, event.originalEvent.pageY + 1);
    }
    event.originalEvent.preventDefault();

    if (this.top === coords.top && this.left === coords.left) {
      this.dropdown.toggleDropdown();
    } else {
      this.top = coords.top;
      this.left = coords.left;
      this.dropdown.closeDropdown();
      this.dropdown.openDropdown();
    }
  }

  hide() {
    this.dropdown.closeDropdown();
  }

  private itemClick(event, item: MenuItem) {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url) {
      event.preventDefault();
    }
    if (item.command) {
      item.command(this.eventArgs.data);
    }
    this.dropdown.closeDropdown();
  }

  private updateStyles() {
    this.style.left = this.left + 'px';
    this.style.top = this.top + 'px';
    this.style.display = (this.dropdown.isOpen && this.menu.length > 0) ? 'block' : 'none';
  }

  private onOpenChange() {
    this.updateStyles();
  }

  private render() {
    const listContent = this.createListContent();
    this.listMenu.textContent = '';
    this.listMenu.append(...listContent);
    this.updateStyles();
  }

  private createListContent(): HTMLElement[] {
    const result = [];
    this.menu.forEach((item, index) => {
      const li = document.createElement('li');
      if (item.disabled) {
        li.classList.add('disabled');
      }

      const a = document.createElement('a');
      a.href = item.url||'#';
      a.textContent = item.label;
      a.dataset.id = index.toString();
      li.append(a);

      const span = document.createElement('span');
      span.classList.add('context-menu-sep');
      a.prepend(span);

      const i = document.createElement('i');
      if (item.icon) {
        i.classList.add(item.icon);
      }
      a.prepend(i)

      result.push(li);
    });
    return result;
  }

  private getDataId(target: HTMLElement): string {
    const el = target.tagName === 'A' ? target : target.closest('a');
    return (el && el.dataset.id) ? el.dataset.id: null;
  }

  private onClickListMenu(event: MouseEvent) {
    const id = this.getDataId(event.target as HTMLElement);
    if (id !== null && id !== undefined) {
      const index = parseInt(id, 10);
      this.itemClick(event, this.menu[index]);
    }
  }

}

customElements.define('web-context-menu', ContextMenuComponent);
