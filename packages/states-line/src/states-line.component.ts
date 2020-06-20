import { StatePoint } from './state-point';
import { StateLine } from './state-line';

export class StatesLineComponent extends HTMLElement {

  points: StatePoint[][];
  dateFrom: Date;
  dateTo: Date;

  series: StateLine[][] = [];

  constructor() {
    super();
  }

  onInit() {
    if (!this.dateFrom) {
      this.dateFrom = new Date();
    }
    if (!this.dateTo) {
      this.dateTo = new Date(this.dateFrom.getFullYear(), this.dateFrom.getMonth(), this.dateFrom.getDate() + 1);
    }
    this.prepareSeries();
  }

  private prepareSeries() {
    this.points.forEach(p => {
      const lines = this.prepareLines(p);
      this.series.push(lines);
    });
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

}

customElements.define('web-states-line', StatesLineComponent);
