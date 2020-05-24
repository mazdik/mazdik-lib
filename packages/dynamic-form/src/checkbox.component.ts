import { InputOptionComponent } from './input-option.component';
import { SelectItem } from '@mazdik-lib/common';

// @Component({
//   selector: 'app-form-checkbox',
//   template: `
//     <div class="dt-group" [ngClass]="{'dt-has-error':dynElement.hasError}">
//       <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
//       <i class="dt-loader" *ngIf="loading"></i>
//       <div *ngFor="let o of getOptions()">
//         <span class="dt-checkbox">
//           <input
//             type="checkbox"
//             [name]="dynElement.name"
//             [value]="o.id"
//             [checked]="isSelectActive(o)"
//             (change)="onChecked($event, o)"
//             [disabled]="disabled"/>
//           <label>{{o.name ? o.name : o.id}}</label>
//         </span>
//       </div>
//       <div class="dt-help-block">
//         <span *ngFor="let err of dynElement.errors">{{err}}<br></span>
//       </div>
//     </div>
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
export class CheckboxComponent extends InputOptionComponent {

  isSelectActive(option: SelectItem): boolean {
    if (Array.isArray(this.value)) {
      return this.value.some(a => a === option.id);
    } else {
      return this.value === option.id;
    }
  }

  onChecked(e: Event, option: SelectItem) {
    const checkbox = e.target as HTMLInputElement;
    (checkbox.checked) ? this.check(option) : this.uncheck(option);
  }

  check(option: SelectItem) {
    if (Array.isArray(this.value)) {
      if (this.value.indexOf(option.id) === -1) {
        this.value.push(option.id);
      }
    } else {
      return this.value = option.id;
    }
  }

  uncheck(option: SelectItem) {
    if (Array.isArray(this.value)) {
      const index = this.value.indexOf(option.id);
      if (index > -1) {
        this.value.splice(index, 1);
      }
    } else {
      return this.value = null;
    }
  }

}
