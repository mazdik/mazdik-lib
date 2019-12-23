import { maxZIndex } from './dom-utils.js';
import { Draggable } from './draggable.js';
import { Resizable, ResizableEvent } from './resizable.js';

interface Listener {
  eventName: string;
  target: HTMLElement | Window;
  handler: (event: Event) => void;
  options?: AddEventListenerOptions | boolean;
}

function getTemplate() {
  return `
  <div class="ui-modal-overlay" id="modalOverlay"></div>
  <div class="ui-modal" tabindex="-1" role="dialog" id="modalRoot">
    <div class="ui-modal-header" id="modalHeader">
      <div class="ui-titlebar" id="titlebar">
      </div>
      <div class="ui-controlbar">
        <i class="ui-icon" id="maximizeIcon"></i>
        <i class="ui-icon dt-icon-close" id="closeIcon"></i>
      </div>
    </div>
    <div class="ui-modal-body" id="modalBody"></div>
    <div class="ui-modal-footer" id="modalFooter"></div>
  </div>
  `;
}

export class ModalComponent extends HTMLElement {

  scrollTopEnable: boolean = true;
  maximizable: boolean = true;
  backdrop: boolean = true;

  get open() {
    return this.hasAttribute('open');
  }

  set open(value) {
    value ? this.setAttribute('open', '') : this.removeAttribute('open');
  }

  private modalOverlay: HTMLElement;
  private modalRoot: HTMLElement;
  private modalBody: HTMLElement;
  private modalHeader: HTMLElement;
  private modalFooter: HTMLElement;
  private maximizeIcon: HTMLElement;
  private closeIcon: HTMLElement;
  private titlebar: HTMLElement;

  private visible: boolean;
  private maximized: boolean;
  private preMaximizeRootWidth: number;
  private preMaximizeRootHeight: number;
  private preMaximizeBodyHeight: number;
  private preMaximizePageX: number;
  private preMaximizePageY: number;

  private listeners: Listener[] = [];

  private draggableDirective: Draggable;
  private resizableDirective: Resizable;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = getTemplate();
    this.appendChild(template.content.cloneNode(true));

    this.modalOverlay = this.querySelector('#modalOverlay');
    this.modalRoot = this.querySelector('#modalRoot');
    this.modalBody = this.querySelector('#modalBody');
    this.modalHeader = this.querySelector('#modalHeader');
    this.modalFooter = this.querySelector('#modalFooter');
    this.maximizeIcon = this.querySelector('#maximizeIcon');
    this.closeIcon = this.querySelector('#closeIcon');
    this.titlebar = this.querySelector('#titlebar');

    this.setDialogStyles();
    this.setMaximizeIconStyles();
    this.renderContent();

    this.draggableDirective = new Draggable(this.modalRoot);
    this.resizableDirective = new Resizable(this.modalRoot);
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    this.removeEventListeners();

    this.draggableDirective.destroy();
    this.resizableDirective.destroy();
  }

  static get observedAttributes() {
    return ['open'];
  }

  attributeChangedCallback(name: string, newValue: any, oldValue: any) {
    switch (name) {
      case 'open':
        this.open ? this.show() : this.hide();
        break;
    }
  }

  addEventListeners() {
    this.listeners = [
      {
        eventName: 'click',
        target: this.closeIcon,
        handler: this.onCloseIconClick.bind(this)
      },
      {
        eventName: 'click',
        target: this.maximizeIcon,
        handler: this.toggleMaximize.bind(this)
      },
      {
        eventName: 'mousedown',
        target: this.modalHeader,
        handler: this.initDrag.bind(this)
      },
      {
        eventName: 'touchstart',
        target: this.modalHeader,
        handler: this.initDrag.bind(this)
      },
      {
        eventName: 'mousedown',
        target: this.modalRoot,
        handler: this.moveOnTop.bind(this)
      },
      {
        eventName: 'touchstart',
        target: this.modalRoot,
        handler: this.moveOnTop.bind(this)
      },
      {
        eventName: 'keydown',
        target: this,
        handler: this.onKeyDown.bind(this)
      },
      {
        eventName: 'resizing',
        target: this.modalRoot,
        handler: this.onResize.bind(this)
      },
      {
        eventName: 'resize',
        target: window,
        handler: this.onWindowResize.bind(this)
      }
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    });
  }

  removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  renderContent() {
    const header = this.querySelector('[select="app-modal-header"]') as HTMLTemplateElement;
    const body = this.querySelector('[select="app-modal-body"]') as HTMLTemplateElement;
    const footer = this.querySelector('[select="app-modal-footer"]') as HTMLTemplateElement;
    if (header) {
      this.titlebar.appendChild(header.content);
    }
    if (body) {
      this.modalBody.appendChild(body.content);
    }
    if (footer) {
      this.modalFooter.appendChild(footer.content);
    }
  }

  show() {
    this.addEventListeners();
    this.center();
    this.visible = true;
    setTimeout(() => {
      this.modalRoot.focus();
      if (this.scrollTopEnable) {
        this.modalBody.scrollTop = 0;
      }
    }, 1);
    this.setDialogStyles();
  }

  hide() {
    this.removeEventListeners();
    this.visible = false;
    this.dispatchEvent(new CustomEvent('closeModal'));
    this.focusLastModal();
    this.setDialogStyles();
  }

  center() {
    let elementWidth = this.modalRoot.offsetWidth;
    let elementHeight = this.modalRoot.offsetHeight;

    if (elementWidth === 0 && elementHeight === 0) {
      this.modalRoot.style.visibility = 'hidden';
      this.modalRoot.style.display = 'block';
      elementWidth = this.modalRoot.offsetWidth;
      elementHeight = this.modalRoot.offsetHeight;
      this.modalRoot.style.display = 'none';
      this.modalRoot.style.visibility = 'visible';
    }

    const x = Math.max((window.innerWidth - elementWidth) / 2, 0);
    const y = Math.max((window.innerHeight - elementHeight) / 2, 0);

    this.modalRoot.style.left = x + 'px';
    this.modalRoot.style.top = y + 'px';
  }

  initDrag(event: MouseEvent | TouchEvent) {
    if (event.target === this.closeIcon) {
      return;
    }
    if (!this.maximized) {
      this.draggableDirective.start(event);
    }
  }

  onResize(event: CustomEvent<ResizableEvent>) {
    if (event.detail.direction === 'vertical') {
      this.calcBodyHeight();
    }
  }

  calcBodyHeight() {
    const diffHeight = this.modalHeader.offsetHeight + this.modalFooter.offsetHeight;
    const contentHeight = this.modalRoot.offsetHeight - diffHeight;
    this.modalBody.style.height = contentHeight + 'px';
    this.modalBody.style.maxHeight = 'none';
  }

  getMaxModalIndex() {
    return maxZIndex('.ui-modal');
  }

  focusLastModal() {
    const modal = this.parentElement.closest('.ui-modal') as HTMLElement;
    if (modal) {
      modal.focus();
    }
  }

  toggleMaximize(event) {
    if (this.maximized) {
      this.revertMaximize();
    } else {
      this.maximize();
    }
    event.preventDefault();
    this.setMaximizeIconStyles();
  }

  maximize() {
    this.preMaximizePageX = parseFloat(this.modalRoot.style.top);
    this.preMaximizePageY = parseFloat(this.modalRoot.style.left);
    this.preMaximizeRootWidth = this.modalRoot.offsetWidth;
    this.preMaximizeRootHeight = this.modalRoot.offsetHeight;
    this.preMaximizeBodyHeight = this.modalBody.offsetHeight;

    this.modalRoot.style.top = '0px';
    this.modalRoot.style.left = '0px';
    this.modalRoot.style.width = '100vw';
    this.modalRoot.style.height = '100vh';
    const diffHeight = this.modalHeader.offsetHeight + this.modalFooter.offsetHeight;
    this.modalBody.style.height = 'calc(100vh - ' + diffHeight + 'px)';
    this.modalBody.style.maxHeight = 'none';

    this.maximized = true;
  }

  revertMaximize() {
    this.modalRoot.style.top = this.preMaximizePageX + 'px';
    this.modalRoot.style.left = this.preMaximizePageY + 'px';
    this.modalRoot.style.width = this.preMaximizeRootWidth + 'px';
    this.modalRoot.style.height = this.preMaximizeRootHeight + 'px';
    this.modalBody.style.height = this.preMaximizeBodyHeight + 'px';

    this.maximized = false;
  }

  moveOnTop() {
    if (!this.backdrop) {
      const maxModalIndex = this.getMaxModalIndex();
      let zIndex = parseFloat(window.getComputedStyle(this.modalRoot).zIndex) || 0;
      if (zIndex <= maxModalIndex) {
        zIndex = maxModalIndex + 1;
        this.modalRoot.style.zIndex = zIndex.toString();
      }
    }
  }

  private setDialogStyles() {
    this.modalRoot.style.display = this.visible ? 'block' : 'none';
    this.modalOverlay.style.display = (this.visible && this.backdrop) ? 'block' : 'none';
  }

  private setMaximizeIconStyles() {
    this.maximizeIcon.style.display = this.maximizable ? 'block' : 'none';
    const cls = this.maximized ? 'dt-icon-normalize' : 'dt-icon-maximize';
    this.maximizeIcon.className = 'ui-icon ' + cls;
  }

  onCloseIconClick() {
    this.hide();
  }

  onKeyDown(event): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.key == 'Escape') {
      this.hide();
    }
  }

  onWindowResize(): void {
    this.center();
  }

}

customElements.define('web-modal', ModalComponent);
