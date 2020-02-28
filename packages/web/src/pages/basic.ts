import { ModalComponent } from '@mazdik-lib/modal';
import html from './basic.html';

export default html;

export function page() {
    // Basic demo
    const dialog = document.querySelector('#modal') as ModalComponent;
    document.querySelector('#button').addEventListener('click', () => dialog.show());

    document.querySelector('#close-button').addEventListener('click', () => dialog.hide());
}
