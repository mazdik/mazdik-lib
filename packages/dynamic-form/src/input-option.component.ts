import { InputComponent } from './input.component';
import { SelectItem, isBlank } from '@mazdik-lib/common';

export class InputOptionComponent extends InputComponent {

  get dependsValue(): any { return this._dependsValue; }
  set dependsValue(value: any) {
    if (this._dependsValue !== value) {
      this._dependsValue = value;
      this.setDependsOptions();
    }
  }
  private _dependsValue: any;

  private _options: SelectItem[];
  private firstCascade: boolean = true;

  onInit() {
    super.onInit();
    if (this.dynElement.optionsUrl && !this.dynElement.dependsElement) {
      this.loadOptions();
    } else {
      this._options = this.dynElement.getOptions(this.dependsValue);
    }
    this.validate();
  }

  setDependsOptions() {
    if (this.dependsValue) {
      if (this.dynElement.optionsUrl) {
        this.loadOptions();
      } else {
        this._options = this.dynElement.getOptions(this.dependsValue);
        this.setDefaultSelect();
      }
    } else {
      this._options = [];
    }
  }

  loadOptions() {
    if (this.dynElement.optionsUrl && this.dynElement.getOptionsFunc) {
      this.loading = true;
      this.dynElement.getOptionsFunc(this.dynElement.optionsUrl, this._dependsValue)
        .then((res) => {
          this._options = res;
          this.setDefaultSelect();
        }).catch(() => {
          this._options = [];
        }).finally(() => {
          this.loading = false;
          this.dispatchEvent(new CustomEvent('loaded', { detail: this.loading }));
        });
    }
  }

  getOptions(): SelectItem[] {
    return this._options;
  }

  onValueChange() {
    if (this.dynElement.keyElement) {
      const data = {
        keyElementName: this.dynElement.keyElement,
        keyElementValue: this.value,
        elementName: this.dynElement.name,
        elementValue: this.getName(),
      };
      this.dispatchEvent(new CustomEvent('keyElementChange', { detail: data }));
    }
  }

  setDefaultSelect() {
    if (this.firstCascade && !isBlank(this.value)) {
      this.value = '';
      if (this._options && this._options.length === 1) {
        this.value = this._options[0].id;
      }
      this.onValueChange();
    }
    this.firstCascade = false;
  }

  getName() {
    if (this._options) {
      const option = this._options.find(x => x.id === this.value);
      return (option) ? option.name : '';
    }
  }

}
