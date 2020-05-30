import { DataSelection } from '../src/base/data-selection';
import { Subject } from 'rxjs';

describe('DataSelection', () => {

  describe('single selection', () => {
    let model: DataSelection<any>;
    const selectionSource: Subject<any> = new Subject();

    beforeEach(() => model = new DataSelection(false, selectionSource));

    it('should be able to select a single value', () => {
      model.select(1);

      expect(model.getSelection().length).toBe(1);
      expect(model.isSelected(1)).toBe(true);
    });

    it('should deselect the previously selected value', () => {
      model.select(1);
      model.select(2);

      expect(model.isSelected(1)).toBe(false);
      expect(model.isSelected(2)).toBe(true);
    });

    it('should be able to determine whether it is empty', () => {
      expect(model.isEmpty()).toBe(true);
      model.select(1);
      expect(model.isEmpty()).toBe(false);
    });

    it('should be able to toggle an option', () => {
      model.toggle(1);
      expect(model.isSelected(1)).toBe(true);

      model.toggle(1);
      expect(model.isSelected(1)).toBe(false);
    });
  });

  describe('multiple selection', () => {
    let model: DataSelection<any>;
    const selectionSource: Subject<any> = new Subject();

    beforeEach(() => model = new DataSelection(true, selectionSource));

    it('should be able to select multiple options', () => {
      model.select(1);
      model.select(2);

      expect(model.getSelection().length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
    });

    it('should be able to select multiple options at the same time', () => {
      model.select(1, 2);

      expect(model.getSelection().length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
    });

    it('should be able to clear the selected options', () => {
      model.select(1);
      model.select(2);
      expect(model.getSelection().length).toBe(2);

      model.clearSelection();
      expect(model.getSelection().length).toBe(0);
      expect(model.isEmpty()).toBe(true);
    });
  });

});
