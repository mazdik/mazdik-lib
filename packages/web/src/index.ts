import '@mazdik-lib/modal';
import { ModalComponent } from '@mazdik-lib/modal';

document.addEventListener('DOMContentLoaded', () => {
  // Basic demo
  const dialog = document.querySelector('#modal') as ModalComponent;
  document.querySelector('#button').addEventListener('click', () => dialog.show());

  // Nested modals demo
  const modal1 = document.querySelector('#modal1') as ModalComponent;
  document.querySelector('#button1').addEventListener('click', () => modal1.show());

  const modal2 = document.querySelector('#modal2') as ModalComponent;
  document.querySelector('#button2').addEventListener('click', () => modal2.show());

  const modal3 = document.querySelector('#modal3') as ModalComponent;
  document.querySelector('#button3').addEventListener('click', () => modal3.show());

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

  // close buttons
  document.querySelector('#close-button').addEventListener('click', () => dialog.hide());
  document.querySelector('#close-button1').addEventListener('click', () => modal1.hide());
  document.querySelector('#close-button2').addEventListener('click', () => modal2.hide());
  document.querySelector('#close-button3').addEventListener('click', () => modal3.hide());
  document.querySelector('#close-panel1').addEventListener('click', () => panel1.hide());
  document.querySelector('#close-panel2').addEventListener('click', () => panel2.hide());
  document.querySelector('#close-panel3').addEventListener('click', () => panel3.hide());
});
