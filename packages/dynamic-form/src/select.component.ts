import { InputOptionComponent } from './input-option.component';

// @Component({
//   selector: 'app-form-select',
//   template: `
//     <div class="dt-group" [ngClass]="{'dt-has-error':dynElement.hasError}">
//       <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
//       <i class="dt-loader" *ngIf="loading"></i>
//       <select class="dt-input"
//               id="{{dynElement.name}}"
//               (change)="model = $event.target.value; onValueChange()"
//               [disabled]="disabled">
//         <option value="" disabled selected hidden>{{placeholder}}</option>
//         <option *ngFor="let opt of getOptions()" [value]="opt.id" [selected]="(opt.id === model)">{{opt.name}}</option>
//       </select>
//       <div class="dt-help-block">
//         <span *ngFor="let err of dynElement.errors">{{err}}<br></span>
//       </div>
//     </div>
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
export class SelectComponent extends InputOptionComponent {

  private select: HTMLSelectElement;

  constructor() {
    super();
    this.createElement();
  }

  private createElement() {
    this.select = document.createElement('select');
    this.select.classList.add('dt-input');
    this.select.disabled = this.disabled;
  }

  private loadSelect() {
    this.select.innerHTML = `<option value="" disabled selected hidden>${this.placeholder}</option>`;
    const options = this.getOptions();
    for (const option of options) {
      this.select.options.add(new Option(option.name, option.id));
    }
    this.setSelectedIndex();
  }

  private setSelectedIndex() {
    const options = this.getOptions();
    if (options && options.length) {
      let index = options.findIndex(x => x.id === this.model.toString());
      index = (index >= 0) ? index + 1 : index; // + 1 selectPlaceholder
      this.select.selectedIndex = index;
    }
  }


}
