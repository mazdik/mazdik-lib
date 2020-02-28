import { ModalComponent } from '@mazdik-lib/modal';
import html from './nested.html';

export default html;

export function page() {
  // Nested modals demo
  const modal1 = document.querySelector('#modal1') as ModalComponent;
  document.querySelector('#button1').addEventListener('click', () => modal1.show());

  const modal2 = document.querySelector('#modal2') as ModalComponent;
  document.querySelector('#button2').addEventListener('click', () => modal2.show());

  const modal3 = document.querySelector('#modal3') as ModalComponent;
  document.querySelector('#button3').addEventListener('click', () => modal3.show());

  document.querySelector('#close-button1').addEventListener('click', () => modal1.hide());
  document.querySelector('#close-button2').addEventListener('click', () => modal2.hide());
  document.querySelector('#close-button3').addEventListener('click', () => modal3.hide());
}
