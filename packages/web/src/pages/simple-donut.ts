import { Page } from '../page';
import '@mazdik-lib/simple-donut';
import { SimpleDonutComponent } from '@mazdik-lib/simple-donut';

export default class SimpleDonutDemo implements Page {

  get template(): string {
    return `<web-simple-donut id="donut1"></web-simple-donut>
    <web-simple-donut id="donut2"></web-simple-donut>
    <web-simple-donut id="donut3"></web-simple-donut>
    <div><web-simple-donut id="donut4"></web-simple-donut></div>`;
  }

  load() {
    const donut1 = document.querySelector('#donut1') as SimpleDonutComponent;
    donut1.perc = 25;

    const donut2 = document.querySelector('#donut2') as SimpleDonutComponent;
    donut2.perc = 50;

    const donut3 = document.querySelector('#donut3') as SimpleDonutComponent;
    donut3.perc = 75;

    const donut4 = document.querySelector('#donut4') as SimpleDonutComponent;
    donut4.size = 240;
    donut4.color = '#FF6384';
    donut4.label = 'label';
    donut4.backgroundLabel = 'background label';
    donut4.backgroundColor = '#FFCE56';
    donut4.perc = 33;
  }

}
