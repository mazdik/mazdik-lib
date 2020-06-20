export class SimpleDonutComponent extends HTMLElement {

  get perc(): number { return this._perc; }
  set perc(val: number) {
    this._perc = val;
    this.render();
  }
  private _perc: number;

  label: string;
  color = '#0070BA';
  backgroundLabel: string;
  backgroundColor = 'rgba(33, 98, 147, 0.15)';
  size = 100;

  get strokeWidth(): number {
    return Math.round(this.size * 0.1);
  }
  get coordinate(): number {
    return this.size / 2;
  }
  get radius(): number {
    return this.coordinate - this.strokeWidth;
  }
  get strokeDasharray(): number {
    return Math.round(Math.PI * (this.radius * 2));
  }
  get strokeDashoffset(): number {
    return this.strokeDasharray - (this.strokeDasharray * (this.perc / 100));
  }

  get title(): string {
    return this.perc >= 0 ? this.perc + '%' : '';
  }

  constructor() {
    super();
  }

  private render() {
    const element = document.createElement('div');
    element.classList.add('simple-donut-container');

    const title = document.createElement('p');
    title.textContent = this.title;
    element.append(title);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.size.toString());
    svg.setAttribute('height', this.size.toString());
    element.append(svg);

    const circle1 = this.createCircle(this.backgroundColor, this.backgroundLabel);
    svg.append(circle1);
    const circle2 = this.createCircle(this.color, this.label);
    circle2.setAttribute('stroke-dasharray', this.strokeDasharray.toString());
    circle2.setAttribute('stroke-dashoffset', this.strokeDashoffset.toString());
    svg.append(circle2);

    this.innerHTML = '';
    this.append(element);
  }

  private createCircle(color: string, label: string): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', this.radius.toString());
    circle.setAttribute('cy', this.coordinate.toString());
    circle.setAttribute('cx', this.coordinate.toString());
    circle.setAttribute('stroke-width', this.strokeWidth.toString());
    circle.setAttribute('stroke', color);
    circle.setAttribute('fill', 'none');

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = label;
    circle.append(title);

    return circle;
  }

}

customElements.define('web-simple-donut', SimpleDonutComponent);
