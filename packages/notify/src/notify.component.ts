import { Message, PositionType } from './types';
import { NotifyItem } from './notify-item';

export class NotifyComponent extends HTMLElement {

  private timeout: any;

  get position(): PositionType { return this._position; }
  set position(val: PositionType) {
    this._position = val;
    this.updateStyles();
  }
  private _position: PositionType;

  constructor() {
    super();
    this.classList.add('dt-notify-container');
  }

  disconnectedCallback() {
    this.clearTimeout();
  }

  private updateStyles() {
    const cls = this.position ? 'dt-n-' + this.position : 'dt-n-top-right';
    this.classList.add(cls);
  }

  sendMessage(message: Message) {
    const item = NotifyItem.createElement(message);
    this.appendChild(item);

    if (!message.sticky) {
      this.initTimeout(item, message.life);
    }
  }

  private initTimeout(element: HTMLElement, life: number) {
    this.timeout = setTimeout(() => {
      element.remove();
    }, life || 3000);
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

}

customElements.define('web-notify', NotifyComponent);
