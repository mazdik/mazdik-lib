import { SimpleLineChartData, createD, createVerticalGuides, createHorizontalGuides } from './simple-line-chart-data';

export class SimpleLineChartComponent extends HTMLElement {

  svgWidth = 200;
  svgHeight = 100;

  get data(): SimpleLineChartData[] { return this._data; }
  set data(val: SimpleLineChartData[]) {
    this._data = val;
    this.render();
  }
  private _data: SimpleLineChartData[] = [];

  private get viewBox(): string {
    return `0 0 ${this.svgWidth} ${this.svgHeight}`;
  }

  private get d(): string {
    return createD(this.data, this.svgWidth, this.svgHeight);
  }

  private get verticalGuides(): string[] {
    return createVerticalGuides(this.svgWidth, this.svgHeight, 1);
  }

  private get horizontalGuides(): string[] {
    return createHorizontalGuides(this.svgWidth, this.svgHeight, 1);
  }

  constructor() {
    super();
  }

  private render(): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', this.viewBox);
    svg.classList.add('simple-line-chart');

    svg.append(...this.createGuides(this.verticalGuides));
    svg.append(...this.createGuides(this.horizontalGuides));
    svg.append(this.createPath(this.d));

    this.innerHTML = '';
    this.append(svg);
  }

  private createGuides(guides: string[]): SVGPolylineElement[] {
    const elements = [];
    guides.forEach(guide => {
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.classList.add('simple-line-chart__guide');
      polyline.setAttribute('points', guide);
      elements.push(polyline);
    });
    return elements;
  }

  private createPath(valueD: string): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('simple-line-chart__line');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.setAttribute('d', valueD);
    return path;
  }

}

customElements.define('web-simple-line-chart', SimpleLineChartComponent);
