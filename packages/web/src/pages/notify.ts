import { Page } from '../page';
import '@mazdik-lib/notify';
import { NotifyComponent } from '@mazdik-lib/notify';

export default class NotifyDemo implements Page {

  get template(): string {
    return `<web-notify></web-notify>
    <button class="dt-button" id="error-button">Error</button>&nbsp;
    <button class="dt-button" id="info-button">Info</button>&nbsp;
    <button class="dt-button" id="notify-button">Notify</button>&nbsp;
    <button class="dt-button" id="success-button">Success</button>&nbsp;
    <button class="dt-button" id="warning-button">Warning</button>
    <button class="dt-button" id="sticky-button">Sticky</button>`;
  }

  load() {
    const notify = document.querySelector('web-notify') as NotifyComponent;
    notify.position = 'top-right';

    const errorButton = document.querySelector('#error-button');
    const infoButton = document.querySelector('#info-button');
    const notifyButton = document.querySelector('#notify-button');
    const successButton = document.querySelector('#success-button');
    const warningButton = document.querySelector('#warning-button');
    const stickyButton = document.querySelector('#sticky-button');

    let counter = 0;

    errorButton.addEventListener('click', () => {
      counter++;
      notify.sendMessage({title: 'Error message', text: 'test message ' + counter, severity: 'error'});
    });

    infoButton.addEventListener('click', () => {
      counter++;
      notify.sendMessage({title: 'Info message', text: 'life 5s test message ' + counter, severity: 'info', life: 5000});
    });

    notifyButton.addEventListener('click', () => {
      counter++;
      notify.sendMessage({title: 'Notify message', text: 'test message ' + counter, severity: 'notify'});
    });

    successButton.addEventListener('click', () => {
      counter++;
      notify.sendMessage({title: 'Success message', text: 'test message ' + counter, severity: 'success'});
    });

    warningButton.addEventListener('click', () => {
      counter++;
      notify.sendMessage({title: 'Warning message', text: 'test message ' + counter, severity: 'warning'});
    });

    stickyButton.addEventListener('click', () => {
      counter++;
      notify.sendMessage({title: 'Sticky message', text: 'test message ' + counter, severity: 'warning', sticky: true});
    });

  }

}
