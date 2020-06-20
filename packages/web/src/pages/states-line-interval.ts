import { Page } from '../page';
import '@mazdik-lib/states-line-interval';
import { StatesLineIntervalComponent } from '@mazdik-lib/states-line-interval';
import { StatePoint } from '@mazdik-lib/states-line';

export default class StatesLineIntervalDemo implements Page {

  get template(): string {
    return `<div class="states-line-interval-demo">
      <web-states-line-interval></web-states-line-interval>
    </div>`;
  }

  load() {
    const points: StatePoint[][] = [
      [
        {dt: new Date(2020, 5, 1, 0, 0), label: 'stop', color: 'DarkSalmon'},
        {dt: new Date(2020, 5, 1, 4, 10), label: 'work', color: 'DarkSeaGreen'},
        {dt: new Date(2020, 5, 1, 8, 33), label: 'stop', color: 'DarkSalmon'},
        {dt: new Date(2020, 5, 1, 12, 22), label: 'work', color: 'DarkSeaGreen'},
        {dt: new Date(2020, 5, 1, 16, 45), label: 'stop', color: 'DarkSalmon'},
        {dt: new Date(2020, 5, 1, 20, 0), label: 'work', color: 'DarkSeaGreen'},
      ],
      [
        {dt: new Date(2020, 5, 1, 0, 0), label: 'stop', color: 'DarkSalmon'},
        {dt: new Date(2020, 5, 1, 12, 0), label: 'work', color: 'DarkSeaGreen'},
      ]
    ];
    const component = document.querySelector('web-states-line-interval') as StatesLineIntervalComponent;
    component.dateFrom = new Date(2020, 5, 1);
    component.dateTo = new Date(2020, 5, 2);
    component.points = points;
  }

}
