import { StatePoint } from './state-point';
import { StateLine } from './state-line';

export class StatesLineComponent extends HTMLElement {

  dateFrom: Date;
  dateTo: Date;

  set points(val: StatePoint[][]) {
    this.init();
    this.series = this.prepareSeries(val);
    this.render();
  }

  private series: StateLine[][] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('states-line');
  }

  init() {
    if (!this.dateFrom) {
      this.dateFrom = new Date();
    }
    if (!this.dateTo) {
      this.dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate() + 1);
    }
  }

  private prepareSeries(points: StatePoint[][]): StateLine[][] {
    const series = points.map(p => this.prepareLines(p));
    return series;
  }

  private prepareLines(points: StatePoint[]): StateLine[] {
    const diffTime = this.getDiffTime(this.dateFrom, this.dateTo);
    const states = points.sort((a, b) => a.dt.getTime() - b.dt.getTime());
    const lines = [];

    states.forEach((x, i) => {

      let dateFrom = states[i].dt;
      let dateTo = (i === states.length - 1) ? this.dateTo : states[i + 1].dt;

      if (dateFrom < this.dateFrom) {
        dateFrom = this.dateFrom;
      }
      if (dateTo > this.dateTo) {
        dateTo = this.dateTo;
      }
      const time = this.getDiffTime(dateFrom, dateTo);
      const formatedTime = this.formatTime(time);
      const line: StateLine = {
        dt: x.dt,
        dateFrom,
        dateTo,
        time,
        percent: (time / diffTime) * 100,
        class: (i % 2 === 0) ? 'state-bottom' : 'state-top',
        color: x.color,
        tooltip: `${x.label} (${formatedTime})`
      };
      if (time > 0) {
        lines.push(line);
      }
    });
    this.checkPercent(lines);
    return lines;
  }

  private getDiffTime(dateFrom: Date, dateTo: Date): number {
    return (dateTo.getTime() - dateFrom.getTime()) / 1000;
  }

  private checkPercent(statesLines: StateLine[]) {
    const sumPersent = Math.round(statesLines.reduce((acc, cur) => acc + cur.percent, 0));
    if (sumPersent > 100 && sumPersent < 100) {
      console.log('StateLine percent: ' + sumPersent);
    }
  }

  private formatTime(time: number): string {
    if (time === 86400) {
      return '24:00:00';
    }
    const date = new Date(null);
    date.setSeconds(time);
    return date.toISOString().substr(11, 8);
  }

  private render() {
    const lineElements = [];
    this.series.forEach(serie => {
      const lineEl = document.createElement('div');
      lineEl.classList.add('state-line');
      lineElements.push(lineEl);

      serie.forEach(col => {
        const colEl = document.createElement('div');
        colEl.classList.add('state-line-col');
        colEl.classList.add(col.class);
        colEl.style.width = col.percent + '%';
        colEl.style.backgroundColor = col.color;
        colEl.title = col.tooltip;
        lineEl.append(colEl);
      });
    });
    this.innerHTML = '';
    this.append(...lineElements);
  }

}

customElements.define('web-states-line', StatesLineComponent);
