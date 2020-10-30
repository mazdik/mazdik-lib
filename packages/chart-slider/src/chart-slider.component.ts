import { isBlank, Listener } from '@mazdik-lib/common';
import { Draggable, DraggableOptions, DraggableEvent } from '@mazdik-lib/draggable';
import { Resizable, ResizableOptions, ResizableEvent } from '@mazdik-lib/resizable';
import { DragToScroll } from '@mazdik-lib/drag-to-scroll';
import { ChartInterval, AxisLabel, ChartSliderData } from './types';
import {
  createChartSliderData, createXAxisLabels, calcHandleDates, calcDatePercentage, getMinMaxHandleTimes, calcPositionPercent, getDiffTime
} from './chart-slider.data';

export class ChartSliderComponent extends HTMLElement {

  get dateFrom(): Date { return this._dateFrom }
  set dateFrom(val: Date) {
    this._dateFrom = val;
    this.onInputChanges();
  }
  private _dateFrom: Date;

  get dateTo(): Date { return this._dateTo }
  set dateTo(val: Date) {
    this._dateTo = val;
    this.onInputChanges();
  }
  private _dateTo: Date;

  get intervals(): ChartInterval[] { return this._intervals; }
  set intervals(val: ChartInterval[]) {
    this._intervals = val;
    this.onInputChanges();
  }
  private _intervals: ChartInterval[];

  get zoom(): number { return this._zoom; }
  set zoom(val: number) {
    if (val && val > 0) {
      this._zoom = val;
      this.zooming();
    }
  }
  private _zoom = 1;

  private handleMultiplier = 2;
  private xAxisLabels: AxisLabel[] = [];
  private chartSliderData: ChartSliderData[] = [];
  private dragEventTarget: MouseEvent | TouchEvent;
  private handleWidth: number;
  private handleMinWidth: number;
  private handleMaxWidth: number;
  private handleLeftPos = 0;
  private chartSliderWidth = 100;

  private countAxisLabels = 15;
  private minHandleTime: number;
  private maxHandleTime: number;

  private slider: HTMLElement;
  private sliderLine: HTMLElement;
  private sliderAxis: HTMLElement;
  private sliderHandle: HTMLElement;
  private sliderHandleBody: HTMLElement;
  private unit = '%';
  private draggableDirective: Draggable;
  private resizableDirective: Resizable;
  private dragToScroll: DragToScroll;

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
    this.draggableDirective.destroy();
    this.resizableDirective.destroy();
    this.dragToScroll.destroy();
  }

  private onInit() {
    this.renderInit();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.listeners = [
      {
        eventName: 'keydown',
        target: window,
        handler: this.onKeyDown.bind(this)
      },
      {
        eventName: 'mousedown',
        target: this.sliderHandleBody,
        handler: this.onMouseDown.bind(this)
      },
      {
        eventName: 'touchstart',
        target: this.sliderHandleBody,
        handler: this.onTouchStart.bind(this)
      },
      {
        eventName: 'dragEnd',
        target: this.sliderHandle,
        handler: this.onDragEnd.bind(this)
      },
      {
        eventName: 'resizeEnd',
        target: this.sliderHandle,
        handler: this.onResizeEnd.bind(this)
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

  private onInputChanges(): void {
    if (this.dateFrom && this.dateTo && this.intervals) {
      this.handleLeftPos = 0;
      [this.minHandleTime, this.maxHandleTime] = getMinMaxHandleTimes(this.dateFrom, this.dateTo, this.handleMultiplier);
      this.createChartSlider();
      this.render();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.decrementHandleLeftPos();
    } else if (event.key === 'ArrowRight') {
      this.incrementHandleLeftPos();
    }
    this.updateStyles();
  }

  private createChartSlider(): void {
    this.handleMinWidth = calcDatePercentage(this.dateFrom, this.dateTo, this.minHandleTime);
    this.handleMaxWidth = calcDatePercentage(this.dateFrom, this.dateTo, this.maxHandleTime);
    this.handleWidth = this.handleMinWidth;
    this.xAxisLabels = createXAxisLabels(this.dateFrom, this.dateTo, this.countAxisLabels, this.zoom);
    this.chartSliderData = createChartSliderData(this.dateFrom, this.dateTo, this.intervals);
  }

  private onDragEnd(event: CustomEvent<DraggableEvent>): void {
    if (event && !isBlank(event.detail.left)) {
      this.handleLeftPos = event.detail.left;
      this.calcDates();
    }
  }

  private onResizeEnd(event: CustomEvent<ResizableEvent>): void {
    if (event && !isBlank(event.detail.width)) {
      this.handleWidth = event.detail.width;
      if (!isBlank(event.detail.left)) {
        this.handleLeftPos = event.detail.left;
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

    requestAnimationFrame(() => {
      const left = (this.scrollWidth - this.clientWidth) * this.handleLeftPos / 100;
      this.scrollLeft = left;
    });
  }

  private renderInit() {
    this.classList.add('chart-slider-wrapper');

    this.slider = document.createElement('div');
    this.slider.classList.add('chart-slider');
    this.append(this.slider);

    this.sliderLine = document.createElement('div');
    this.sliderLine.classList.add('chart-slider__line');
    this.slider.append(this.sliderLine);

    this.sliderAxis = document.createElement('div');
    this.sliderAxis.classList.add('chart-slider__axis');
    this.slider.append(this.sliderAxis);

    this.sliderHandle = document.createElement('div');
    this.sliderHandle.classList.add('chart-slider__handle');

    this.sliderHandleBody = document.createElement('div');
    this.sliderHandleBody.classList.add('chart-slider__handle__body');
    this.sliderHandle.append(this.sliderHandleBody);

    const draggableOptions: DraggableOptions = {
      dragX: true,
      dragY: false,
      inViewport: true,
      relative: true,
      inPercentage: true,
      stopPropagation: true,
    }
    this.draggableDirective = new Draggable(this.sliderHandle, draggableOptions);
    const resizableOptions: ResizableOptions = {
      south: false,
      east: true,
      southEast: false,
      west: true,
      inPercentage: true,
    };
    this.resizableDirective = new Resizable(this.sliderHandle, resizableOptions);
    this.resizableDirective.addEventListeners();
    this.dragToScroll = new DragToScroll(this, { dragX: true, dragY: false });
  }

  private render() {
    const lineCols = this.chartSliderData.map(data => {
      const lineCol = document.createElement('div');
      lineCol.classList.add('chart-slider__line__col');
      lineCol.style.width = data.widthPercent + this.unit;
      lineCol.style.left = data.positionPercent + this.unit;

      const lineColItems = data.items.map(item => {
        const lineColItem = document.createElement('div');
        lineColItem.classList.add('chart-slider__line__col__item');
        lineColItem.style.height = item.heightPercent + this.unit;
        lineColItem.style.backgroundColor = item.color;
        return lineColItem;
      });
      lineCol.append(...lineColItems);

      return lineCol;
    });
    this.sliderLine.innerHTML = '';
    this.sliderLine.append(...lineCols);
    this.sliderLine.append(this.sliderHandle);

    const axisItems = this.xAxisLabels.map((xAxisLabel, index) => {
      const element = document.createElement('div');
      element.classList.add('chart-slider__axis__item');
      if (index === this.xAxisLabels.length - 1) {
        element.classList.add('last');
      }
      element.style.width = xAxisLabel.widthPercent + this.unit;
      element.style.left = xAxisLabel.positionPercent + this.unit;
      element.textContent = xAxisLabel.name;
      return element;
    });
    this.sliderAxis.innerHTML = '';
    this.sliderAxis.append(...axisItems);

    this.updateStyles();
  }

  private updateStyles() {
    this.slider.style.width = this.chartSliderWidth + this.unit;
    this.sliderHandle.style.width = this.handleWidth + this.unit;
    this.sliderHandle.style.minWidth = this.handleMinWidth + this.unit;
    this.sliderHandle.style.maxWidth = this.handleMaxWidth + this.unit;
    this.sliderHandle.style.left = this.handleLeftPos + this.unit;
  }

  private onMouseDown(event: MouseEvent) {
    this.draggableDirective.start(event);
  }

  private onTouchStart(event: TouchEvent) {
    this.draggableDirective.start(event);
  }

}

customElements.define('web-chart-slider', ChartSliderComponent);
