import '@mazdik-lib/states-line';
import { StatePoint, StatesLineComponent } from '@mazdik-lib/states-line';
import { StateLineInterval } from './state-line-interval';

export class StatesLineIntervalComponent extends HTMLElement {

  dateFrom: Date;
  dateTo: Date;

  set points(val: StatePoint[][]) {
    this.prepareData();
    this.render();
    this.renderStatesline(val);
  }

  private intervals: StateLineInterval[] = [];
  private countIntervals = 12;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('states-line-interval');
  }

  private prepareData() {
    const diffTime = this.getDiffTime(this.dateFrom, this.dateTo);
    const interval = diffTime / this.countIntervals;
    const percent = (interval / diffTime) * 100;
    const intervals = [];
    for (let index = 0; index <= this.countIntervals; index++) {
      const val: StateLineInterval = {
        dateFrom: new Date(this.dateFrom.getTime() + interval * 1000 * index),
        dateTo: new Date(this.dateFrom.getTime() + interval * 1000 * (index + 1)),
        percent: percent * index,
        label: '',
      };
      val.label = this.createLabel(val.dateFrom, diffTime);
      intervals.push(val);
    }
    this.intervals = intervals;
  }

  private createLabel(date: Date, diffTime: number): string {
    const dateString = this.toISOStringIgnoreTZ(date);
    if (diffTime <= 86400) {
      const hours = dateString.substr(11, 5);
      return (hours === '00:00' && this.getDiffTime(this.dateFrom, date) === 86400) ? '24:00' : hours;
    } else {
      return dateString.substr(0, 10);
    }
  }

  private getDiffTime(dateFrom: Date, dateTo: Date): number {
    return (dateTo.getTime() - dateFrom.getTime()) / 1000;
  }

  private toISOStringIgnoreTZ(date: Date): string {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  }

  private render() {
    const elements = [];
    this.intervals.forEach(interval => {
      const element = document.createElement('div');
      element.classList.add('state-line-interval');
      element.style.left = interval.percent + '%';
      elements.push(element);

      const label = document.createElement('div');
      label.classList.add('state-line-interval-label');
      label.style.left = interval.percent + '%';
      label.textContent = interval.label;
      elements.push(label);
    });

    this.innerHTML = '';
    this.append(...elements);
  }

  private renderStatesline(points: StatePoint[][]) {
    const statesline = document.createElement('web-states-line') as StatesLineComponent;
    this.append(statesline);
    statesline.dateFrom = this.dateFrom;
    statesline.dateTo = this.dateTo;
    statesline.points = points;
  }

}

customElements.define('web-states-line-interval', StatesLineIntervalComponent);
