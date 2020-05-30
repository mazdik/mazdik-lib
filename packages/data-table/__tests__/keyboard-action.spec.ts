import { KeyboardAction } from '../src/base/keyboard-action';
import { Events } from '../src/base/events';
import { DataSelection } from '../src/base/data-selection';
import { Keys } from '@mazdik-lib/common';

describe('KeyboardAction', () => {
  let fixture: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
    <div class="datatable-row">
      <div class="datatable-body-cell" data-column-index="1" data-row-index="4">
        <div class="dt-inline-data"></div>
      </div>
    </div>
    `;
    fixture = document.querySelector('.dt-inline-data');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const events = new Events();
  const dataSelection = new DataSelection<number>(false, events.selectionSource);
  const keyboardAction = new KeyboardAction(events, dataSelection);

  function testKey(keyCode: number, col: number, row: number, shiftKey: boolean = false) {
    events.cellSource$.subscribe(event => {
      expect(event.columnIndex).toBe(1 + col);
      expect(event.rowIndex).toBe(4 + row);
      expect(event.event).toBeDefined();
      expect(event.fromCell).toBeDefined();
    });

    fixture.addEventListener('keydown', event => {
      keyboardAction.handleEvent(event, fixture, 6, 6);
    });

    const ev = new KeyboardEvent('keydown', {
      bubbles : true,
      cancelable : true,
      shiftKey,
      keyCode,
    } as KeyboardEventInit);
    fixture.dispatchEvent(ev);
  }

  describe('action keys', () => {

    it('should be able to handle event Keys.ENTER', () => {
      testKey(Keys.ENTER, 0, 0);
    });

    it('should be able to handle event Keys.ESCAPE', () => {
      testKey(Keys.ESCAPE, 0, 0);
    });

    it('should be able to handle event Keys.KEY_F2', () => {
      testKey(Keys.KEY_F2, 0, 0);
    });

  });

  describe('navigation keys', () => {

    it('should be able to handle event Keys.TAB', () => {
      testKey(Keys.TAB, 1, 0);
    });

    it('should be able to handle event Keys.RIGHT', () => {
      testKey(Keys.RIGHT, 1, 0);
    });

    it('should be able to handle event Keys.TAB + shiftKey', () => {
      testKey(Keys.TAB, -1, 0, true);
    });

    it('should be able to handle event Keys.LEFT', () => {
      testKey(Keys.LEFT, -1, 0);
    });

    it('should be able to handle event Keys.UP', () => {
      testKey(Keys.UP, 0, -1);
    });

    it('should be able to handle event Keys.DOWN', () => {
      testKey(Keys.DOWN, 0, 1);
    });

  });

});
