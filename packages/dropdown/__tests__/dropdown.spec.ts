import { DropDown } from '../src/drop-down';

class TestFixtureComponent {
  dropdown: DropDown;
  constructor(private element: HTMLElement) {
    this.dropdown = new DropDown(this.element);
  }
}

describe('DropDown', () => {
  let fixture: HTMLElement;
  let component: TestFixtureComponent;

  beforeEach(() => {
    document.body.innerHTML = `<div id="test" style="width: 100px; height: 100px;"></div>`;
    fixture = document.getElementById('test');
    component = new TestFixtureComponent(fixture);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be able open dropdown', () => {
    component.dropdown.openDropdown();
    expect(component.dropdown.isOpen).toBe(true);
  });

  it('should be able close dropdown', () => {
    component.dropdown.isOpen = true;
    component.dropdown.closeDropdown();
    expect(component.dropdown.isOpen).toBe(false);
  });

  it('should be selectContainerClicked = true on click', () => {
    component.dropdown.isOpen = true;
    fixture.dispatchEvent(new MouseEvent('click'));

    expect(component.dropdown.selectContainerClicked).toBe(true);
  });

  it('should be dropdown closed on click window', () => {
    component.dropdown.isOpen = true;
    document.dispatchEvent(new MouseEvent('click'));

    expect(component.dropdown.isOpen).toBe(false);
    expect(component.dropdown.selectContainerClicked).toBe(false);
  });

  it('should be dropdown closed on keydown esc', () => {
    component.dropdown.isOpen = true;
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));

    expect(component.dropdown.isOpen).toBe(false);
  });

  it('should be able to observe when opening', () => {
    const spy = jest.fn(x => x.detail);
    fixture.addEventListener('open', spy);

    component.dropdown.openDropdown();
    expect(spy).toHaveBeenCalledTimes(1);
    // expect(spy).toHaveBeenCalledWith(true);
    expect(component.dropdown.isOpen).toBe(true);
  });

  it('should be able to observe when closing', () => {
    const spy = jest.fn(x => x.detail);
    fixture.addEventListener('open', spy);

    component.dropdown.isOpen = true;
    component.dropdown.closeDropdown();
    expect(spy).toHaveBeenCalledTimes(1);
    // expect(spy).toHaveBeenCalledWith(false);
    expect(component.dropdown.isOpen).toBe(false);
  });

});
