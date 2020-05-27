import { InputBaseComponent } from './input-base.component';
import { SelectItem, isBlank } from '@mazdik-lib/common';

export class InputOptionComponent extends InputBaseComponent {

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
      this.onLoadOptions();
    }
  }

  setDependsOptions() {
    if (this.dependsValue) {
      if (this.dynElement.optionsUrl) {
        this.loadOptions();
      } else {
        this._options = this.dynElement.getOptions(this.dependsValue);
        this.onLoadOptions();
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
          this.onLoadOptions();
        }).catch(() => {
          this._options = [];
        }).finally(() => {
          this.loading = false;
        });
    }
  }

  onLoadOptions() {
    this.setDefaultSelect();
    this.validate();
  }

  getOptions(): SelectItem[] {
    return this._options;
  }

  setDefaultSelect() {
    if (this.firstCascade && isBlank(this.value)) {
      this.value = '';
      if (this._options && this._options.length === 1) {
        this.value = this._options[0].id;
      }
    }
    this.firstCascade = false;
  }

}
