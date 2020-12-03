import { Page } from '../page';
import '@mazdik-lib/simple-line-chart';
import { SimpleLineChartComponent } from '@mazdik-lib/simple-line-chart';

export default class SimpleLineChartDemo implements Page {

  get template(): string {
    return `<web-simple-line-chart class="simple-line-chart-demo"></web-simple-line-chart>`;
  }

  load() {
    const component = document.querySelector('web-simple-line-chart') as SimpleLineChartComponent;
    component.data = [
      { x: 0, y: 60 },
      { x: 50, y: 50 },
      { x: 100, y: 75 },
      { x: 150, y: 50 },
      { x: 200, y: 150 },
      { x: 250, y: 155 },
      { x: 300, y: 190 },
      { x: 350, y: 90 },
      { x: 400, y: 110 },
      { x: 450, y: 40 },
      { x: 500, y: 50 },
      { x: 550, y: 80 },
      { x: 600, y: 130 },
      { x: 650, y: 120 },
      { x: 700, y: 140 },
      { x: 750, y: 100 },
      { x: 800, y: 90 },
    ];
  }

}
