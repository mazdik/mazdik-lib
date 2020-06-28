import { Page } from '../page';
import '@mazdik-lib/simple-bar-chart';
import { SimpleBarChartComponent, SimpleBarChartData } from '@mazdik-lib/simple-bar-chart';

export default class SimpleBarChartDemo implements Page {

  get template(): string {
    return `<div class="simple-bar-chart-demo">
      <web-simple-bar-chart></web-simple-bar-chart>
    </div>`;
  }

  load() {
    const data: SimpleBarChartData[] = [
      {x: '01.20', y: 90, color: 'rgb(134, 172, 65)'},
      {x: '02.20', y: 77, color: 'rgb(134, 172, 65)'},
      {x: '03.20', y: 66, color: 'rgb(134, 172, 65)'},
      {x: '04.20', y: 33, color: 'rgb(134, 172, 65)'},
      {x: '05.20', y: 90, color: 'rgb(134, 172, 65)'},
      {x: '06.20', y: 100, color: 'rgb(134, 172, 65)'},
    ];
    const component = document.querySelector('web-simple-bar-chart') as SimpleBarChartComponent;
    component.barChartData = data;
  }

}
