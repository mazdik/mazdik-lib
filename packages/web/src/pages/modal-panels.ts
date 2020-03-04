import { ModalComponent } from '@mazdik-lib/modal';
import html from './modal-panels.html';

export default html;

export function page() {
  // Panels demo
  const panel1 = document.querySelector('#panel1') as ModalComponent;
  panel1.backdrop = false;
  document.querySelector('#button-panel1').addEventListener('click', () => panel1.show());

  const panel2 = document.querySelector('#panel2') as ModalComponent;
  panel2.backdrop = false;
  document.querySelector('#button-panel2').addEventListener('click', () => panel2.show());

  const panel3 = document.querySelector('#panel3') as ModalComponent;
  panel3.backdrop = false;
  document.querySelector('#button-panel3').addEventListener('click', () => panel3.show());

  document.querySelector('#close-panel1').addEventListener('click', () => panel1.hide());
  document.querySelector('#close-panel2').addEventListener('click', () => panel2.hide());
  document.querySelector('#close-panel3').addEventListener('click', () => panel3.hide());
}
