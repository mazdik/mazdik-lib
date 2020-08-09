# Vanilla Web Components

<a target="_blank" href="https://mazdik.github.io/mazdik-lib">Demo</a>

### Run in development mode
```
npm run bootstrap
npm run watch
npm run s
```

### Build demo app
```
npm run b --prod
```

## Resizable and draggable modal
```
npm install @mazdik-lib/modal
```

### Sample
```html
  <link href="styles/modal.component.css" rel="stylesheet">
  <script type="module" src="dist/modal.component.js"></script>

  <button id="button" class="dt-button">Open modal</button>
  <web-modal id="modal">
    <template select="app-modal-header">
      <span>Modal</span>
    </template>
    <template select="app-modal-body">
      <h3>MODAL DIALOG</h3>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.</p>
    </template>
    <template select="app-modal-footer">
      <button class="dt-button dt-red">Delete</button>&nbsp;
      <button class="dt-button dt-green">Save</button>
      <button id="close-button" class="dt-button dt-blue" style="float: right;">Close</button>
    </template>
  </web-modal>

  <script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function (event) {
      const dialog = document.querySelector('#modal');
      document.querySelector('#button').addEventListener('click', () => dialog.show());
    });
  </script>
```

### CSS
```css
.modal-demo .ui-modal {
  width: 37.5rem;
  /* for resize limits use min-width, min-height, max-width, max-height in css */
}
.modal-demo .ui-modal-overlay, .modal-demo .ui-modal {
  z-index: 10;
}
/* colors */
:root {
  --dt-color-primary: #5b9bd5;
}
/* for IE */
.ui-modal-header {
  background-color: #5b9bd5;
}
```

### Properties

| Attribute        | Type       | Default | Description |
|------------------|------------|---------|-------------|
| scrollTopEnable  | boolean    | true    |             |
| maximizable      | boolean    | true    |             |
| backdrop         | boolean    | true    |             |
| inViewport       | boolean    | true    |             |

### Events
```js
  dialog.addEventListener('closeModal', (ev) => {
    console.log(ev);
  });
  dialog.modalRoot.addEventListener('dragStart', (ev) => {
    console.log(ev);
  });
  dialog.modalRoot.addEventListener('dragMove', (ev) => {
    console.log(ev);
  });
  dialog.modalRoot.addEventListener('dragEnd', (ev) => {
    console.log(ev);
  });
  dialog.modalRoot.addEventListener('resizeBegin', (ev) => {
    console.log(ev);
  });
  dialog.modalRoot.addEventListener('resizeEnd', (ev) => {
    console.log(ev);
  });
  dialog.modalRoot.addEventListener('resizing', (ev) => {
    console.log(ev);
  });
```
