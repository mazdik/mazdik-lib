import { Message } from './types';

export class NotifyItem {

  static createElement(message: Message): HTMLElement {
    const item = document.createElement('div');
    item.classList.add('dt-notify-item');
    const cls = message.severity ? 'dt-notify-' + message.severity : 'dt-notify-notify';
    item.classList.add(cls);

    if (message.title) {
      item.append(this.addTitle(message.title));
    }
    if (message.text) {
      item.append(this.addText(message.text));
    }
    item.append(this.addClose(item));
    return item;
  }

  private static addTitle(title: string): HTMLElement {
    const item = document.createElement('div');
    item.classList.add('dt-notify-title');
    item.innerHTML = title;
    return item;
  }

  private static addText(text: string): HTMLElement {
    const item = document.createElement('div');
    item.classList.add('dt-notify-text');
    item.innerHTML = text;
    return item;
  }

  private static addClose(parent: HTMLElement): HTMLElement {
    const item = document.createElement('span');
    item.classList.add('dt-n-close');
    item.addEventListener('click', () => {
      parent.remove();
    });
    return item;
  }

}
