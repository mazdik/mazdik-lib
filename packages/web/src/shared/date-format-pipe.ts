import { PipeTransform } from '@mazdik-lib/data-table';

export class DateFormatPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return value;
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(value).toLocaleTimeString([], options);
  }
}
