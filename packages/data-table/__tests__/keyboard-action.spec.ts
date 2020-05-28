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

  function testKey(spy, col: number, row: number) {
    keyboardAction.handleEvent(component.evt, fixture, 6, 6);
    const event = spy.calls.mostRecent().args[0];

    expect(spy).toHaveBeenCalled();
    expect(event.columnIndex).toBe(1 + col);
    expect(event.rowIndex).toBe(4 + row);
    expect(event.event).toBeDefined();
    expect(event.fromCell).toBeDefined();
  }

  function triggerKeydown(keyCode: number, shiftKey: boolean = false) {
    fixture.dispatchEvent(new KeyboardEvent('keydown', { keyCode } as KeyboardEventInit));
    // fixture.triggerEventHandler('keydown', {
    //   target: debugElement.nativeElement,
    //   keyCode,
    //   shiftKey,
    //   preventDefault: () => null,
    //   stopPropagation: () => null,
    // });
  }

  describe('action keys', () => {
    const spy = jasmine.createSpy('changed spy');
    events.cellSource$.subscribe(spy);

    it('should be able to handle event Keys.ENTER', () => {
      triggerKeydown(Keys.ENTER);
      testKey(spy, 0, 0);
    });

    it('should be able to handle event Keys.ESCAPE', () => {
      triggerKeydown(Keys.ESCAPE);
      testKey(spy, 0, 0);
    });

    it('should be able to handle event Keys.KEY_F2', () => {
      triggerKeydown(Keys.KEY_F2);
      testKey(spy, 0, 0);
    });

  });

  describe('navigation keys', () => {
    const spy = jasmine.createSpy('changed spy');
    events.cellSource$.subscribe(spy);

    it('should be able to handle event Keys.TAB', () => {
      triggerKeydown(Keys.TAB);
      testKey(spy, 1, 0);
    });

    it('should be able to handle event Keys.RIGHT', () => {
      triggerKeydown(Keys.RIGHT);
      testKey(spy, 1, 0);
    });

    it('should be able to handle event Keys.TAB + shiftKey', () => {
      triggerKeydown(Keys.TAB, true);
      testKey(spy, -1, 0);
    });

    it('should be able to handle event Keys.LEFT', () => {
      triggerKeydown(Keys.LEFT);
      testKey(spy, -1, 0);
    });

    it('should be able to handle event Keys.UP', () => {
      triggerKeydown(Keys.UP);
      testKey(spy, 0, -1);
    });

    it('should be able to handle event Keys.DOWN', () => {
      triggerKeydown(Keys.DOWN);
      testKey(spy, 0, 1);
    });

  });

});
