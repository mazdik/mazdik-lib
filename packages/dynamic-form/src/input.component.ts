import { DynamicFormElement } from './dynamic-form-element';

export class InputComponent {

  dynElement: DynamicFormElement;
  disabled: boolean;
  placeholder: string;

  get model(): any { return this._model; }
  set model(value: any) {
    if (this._model !== value) {
      this._model = value;
      this.valueChange.emit(this._model);
      this.validate();
    }
  }
  private _model: any;

  valueChange: any;   //@Output()
  valid: any;   // @Output()

  loading: boolean;

  constructor() { }

  ngOnInit() {
    this.validate();
  }

  validate() {
    this.dynElement.validate();
    this.valid.emit(!this.dynElement.hasError);
  }

}
