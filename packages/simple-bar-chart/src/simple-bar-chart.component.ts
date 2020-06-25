export interface SimpleBarChartData {
  x: string;
  y: number;
  color: string;
}

export class SimpleBarChartComponent extends HTMLElement {

  get barChartData(): SimpleBarChartData[] { return this._barChartData; }
  set barChartData(val: SimpleBarChartData[]) {
    this._barChartData = val;
    this.xticks = val ? val.map(x => x.x) : [];
    this.render();
  }
  private _barChartData: SimpleBarChartData[] = [];

  xticks: any[] = [];
  yticks: any[] = [100, 80, 60, 40, 20, 0];

  get itemWidth(): number {
    return (this.barChartData && this.barChartData.length) ? 100 * (1 / (this.barChartData.length * 2)) : null;
  }

  private left: HTMLElement;
  private main: HTMLElement;
  private bottom: HTMLElement;

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('simple-bar-vertical');

    const top = document.createElement('div');
    top.classList.add('simple-bar-vertical-top');
    this.append(top);

    this.left = document.createElement('div');
    this.left.classList.add('simple-bar-vertical-left');
    top.append(this.left);

    this.main = document.createElement('div');
    this.main.classList.add('simple-bar-vertical-main');
    top.append(this.main);

    this.bottom = document.createElement('div');
    this.bottom.classList.add('simple-bar-vertical-bottom');
    this.append(this.bottom);
  }

  private render() {
    this.left.innerHTML = '';
    this.left.append(...this.createTicksElements(this.yticks));

    this.main.innerHTML = '';
    this.main.append(...this.createBarElements());

    this.bottom.innerHTML = '';
    this.bottom.append(...this.createTicksElements(this.xticks));
  }

  private createTicksElements(ticks: any[]): HTMLElement[] {
    return ticks.map(tick => {
      const element = document.createElement('span');
      element.textContent = tick;
      return element;
    });
  }

  private createBarElements(): HTMLElement[] {
    return this.barChartData.map(item => {
      const element = document.createElement('div');
      element.style.width = this.itemWidth + '%';
      element.style.background = item.color;
      element.style.height = item.y + '%';
      element.title = item.y.toString();
      return element;
    });
  }

}

customElements.define('web-simple-bar-chart', SimpleBarChartComponent);
