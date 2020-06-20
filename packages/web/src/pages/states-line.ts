import { Page } from '../page';
import '@mazdik-lib/states-line';
import { StatesLineComponent, StatePoint } from '@mazdik-lib/states-line';

export default class StatesLineDemo implements Page {

  get template(): string {
    return `<div class="states-line-demo1">
      <web-states-line id="states-line1"></web-states-line>
    </div>
    <p>Custom CSS</p>
    <div class="states-line-demo2">
      <web-states-line id="states-line2"></web-states-line>
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

    const component = document.querySelector('#states-line1') as StatesLineComponent;
    component.dateFrom = new Date(2020, 5, 1);
    component.dateTo = new Date(2020, 5, 2);
    component.points = points;

    const component2 = document.querySelector('#states-line2') as StatesLineComponent;
    component2.dateFrom = new Date(2020, 5, 1);
    component2.dateTo = new Date(2020, 5, 2);
    component2.points = points;
  }

}
