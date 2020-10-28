import { isBlank, Listener } from '@mazdik-lib/common';
import { DraggableEvent } from '@mazdik-lib/draggable';
import { ResizableEvent } from '@mazdik-lib/resizable';
import { ChartInterval, AxisLabel, ChartSliderData } from './types';
import {
  createChartSliderData, createXAxisLabels, calcHandleDates, calcDatePercentage, getMinMaxHandleTimes, calcPositionPercent, getDiffTime
 } from './chart-slider.data';

export class ChartSliderComponent extends HTMLElement {

  dateFrom: Date;
  dateTo: Date;
  intervals: ChartInterval[];
  handleMultiplier = 2;

  get zoom(): number { return this._zoom; }
  set zoom(val: number) {
    if (val && val > 0) {
      this._zoom = val;
      this.zooming();
    }
  }
  private _zoom = 1;

  xAxisLabels: AxisLabel[] = [];
  chartSliderData: ChartSliderData[] = [];
  dragEventTarget: MouseEvent | TouchEvent;
  handleWidth: number;
  handleMinWidth: number;
  handleMaxWidth: number;
  handleLeftPos = 0;
  chartSliderWidth = 100;

  private countAxisLabels = 15;
  private minHandleTime: number;
  private maxHandleTime: number;

  private element: HTMLElement;
  private sliderLine: HTMLElement;
  private sliderAxis: HTMLElement;

  private listeners: Listener[] = [];
  private isInitialized: boolean;

  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.isInitialized) {
      this.onInit();
      this.isInitialized = true;
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  private onInit() {
    this.classList.add('chart-slider-wrapper');

    this.element = document.createElement('div');
    this.element.classList.add('chart-slider');
    this.append(this.element);

    this.sliderLine = document.createElement('div');
    this.sliderLine.classList.add('chart-slider__line');
    this.element.append(this.sliderLine);

    this.sliderAxis = document.createElement('div');
    this.sliderAxis.classList.add('chart-slider__axis');
    this.element.append(this.sliderAxis);

    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'keydown',
        target: window,
        handler: this.onKeyDown.bind(this)
      },
    ];

    this.listeners.forEach(x => {
      x.target.addEventListener(x.eventName, x.handler);
    })
  }

  private removeEventListeners() {
    this.listeners.forEach(x => {
      x.target.removeEventListener(x.eventName, x.handler);
    });
  }

  ngOnChanges(): void {
    if (this.dateFrom && this.dateTo && this.intervals) {
      this.handleLeftPos = 0;
      [this.minHandleTime, this.maxHandleTime] = getMinMaxHandleTimes(this.dateFrom, this.dateTo, this.handleMultiplier);
      this.createChartSlider();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.decrementHandleLeftPos();
    } else if (event.key === 'ArrowRight') {
      this.incrementHandleLeftPos();
    }
  }

  private createChartSlider(): void {
    this.handleMinWidth = calcDatePercentage(this.dateFrom, this.dateTo, this.minHandleTime);
    this.handleMaxWidth = calcDatePercentage(this.dateFrom, this.dateTo, this.maxHandleTime);
    this.handleWidth = this.handleMinWidth;
    this.xAxisLabels = createXAxisLabels(this.dateFrom, this.dateTo, this.countAxisLabels, this.zoom);
    this.chartSliderData = createChartSliderData(this.dateFrom, this.dateTo, this.intervals);
  }

  private onDragEnd(event: DraggableEvent): void {
    if (event && !isBlank(event.left)) {
      this.handleLeftPos = event.left;
      this.calcDates();
    }
  }

  private onResizeEnd(event: ResizableEvent): void {
    if (event && !isBlank(event.width)) {
      this.handleWidth = event.width;
      if (!isBlank(event.left)) {
        this.handleLeftPos = event.left;
      }
      this.calcDates();
    }
  }

  private calcDates(): void {
    const result = calcHandleDates(this.dateFrom, this.dateTo, this.handleLeftPos, this.handleLeftPos + this.handleWidth);
    this.dispatchEvent(new CustomEvent('sliderChange', { detail: result }));
  }

  private incrementHandleLeftPos(): void {
    const rightPos = this.handleLeftPos + this.handleWidth;
    if (rightPos < 100) {
      const newValue = this.handleLeftPos + 1;
      this.handleLeftPos = Math.min(newValue, 100 - this.handleWidth);
      this.calcDates();
    }
  }

  private decrementHandleLeftPos(): void {
    if (this.handleLeftPos > 0) {
      const newValue = this.handleLeftPos - 1;
      this.handleLeftPos = Math.max(newValue, 0);
      this.calcDates();
    }
  }

  private zooming(): void {
    this.chartSliderWidth = 100 * this.zoom;
    this.handleLeftPos = 0;
    this.createChartSlider();
  }

  private setOffsetX(dateFrom: Date, dateTo: Date, zoom: number): void {
    this._zoom = zoom;
    this.chartSliderWidth = 100 * this.zoom;
    this.minHandleTime = getDiffTime(dateFrom, dateTo);
    this.handleLeftPos = calcPositionPercent(this.dateFrom, this.dateTo, dateFrom, this.handleWidth);
    this.createChartSlider();

    requestAnimationFrame (() => {
      const left = (this.element.scrollWidth - this.element.clientWidth) * this.handleLeftPos / 100;
      this.element.scrollLeft = left;
    });
  }

  private updateStyles() {
    this.element.style.width = this.chartSliderWidth + '%';
  }

}

customElements.define('web-chart-slider', ChartSliderComponent);
