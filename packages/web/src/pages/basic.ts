import { ModalComponent } from '@mazdik-lib/modal';

export default `
    <h1>This is basic.<h1>
`;

export function page() {
    // Basic demo
    const dialog = document.querySelector('#modal') as ModalComponent;
    document.querySelector('#button').addEventListener('click', () => dialog.show());

    document.querySelector('#close-button').addEventListener('click', () => dialog.hide());
}
