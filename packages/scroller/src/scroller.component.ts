import { RowHeightCache } from './row-height-cache';
import { ScrollerEventArgs } from './types';
import { isBlank } from '@mazdik-lib/common';

export class ScrollerComponent extends HTMLElement {

  rowHeight: number;
  itemsPerRow: number = 20;
  rowHeightProp: string;

  get items(): HTMLElement[] { return this._items; }
  set items(val: HTMLElement[]) {
    this._items = val;
    this.initChunkRows();
  }
  private _items: HTMLElement[];

  private contentEl: HTMLElement;
  private paddingEl: HTMLElement;

  get viewRows(): HTMLElement[] {
    return this._viewRows;
  }
  set viewRows(val: HTMLElement[]) {
    this._viewRows = val;
    this.contentEl.innerHTML = '';
    this.contentEl.append(...val);
    this.dispatchEvent(new CustomEvent('viewRowsChange', { detail: val }));
  }
  private _viewRows: HTMLElement[];

  scrollYPos: number = 0;
  scrollXPos: number = 0;
  prevScrollYPos: number = 0;
  prevScrollXPos: number = 0;
  element: HTMLElement;
  scrollLength: number;
  start: number;
  end: number;
  topPadding: number = 0;
  bottomPadding: number = 0;
  private previousStart: number;
  private previousEnd: number;
  private rowHeightCache: RowHeightCache = new RowHeightCache();
  private scrollListener: any;
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
    this.removeEventListener('scroll', this.scrollListener);
  }

  private onInit() {
    this.classList.add('dt-scroller', 'dt-virtual-scroll');

    this.contentEl = document.createElement('div');
    this.contentEl.classList.add('dt-scrollable-content');
    this.append(this.contentEl);

    this.paddingEl = document.createElement('div');
    this.paddingEl.classList.add('dt-total-padding');
    this.append(this.paddingEl);

    this.scrollListener = this.onScrolled.bind(this);
    this.addEventListener('scroll', this.scrollListener);
  }

  private initChunkRows() {
    if (!isBlank(this.items) && !isBlank(this.rowHeight)) {
      this.resetPosition();
      this.chunkRows(true);
      this.bottomPadding = this.scrollLength - this.topPadding - this.scrollHeight;
    }
  }

  private onScrolled(event: MouseEvent) {
    const dom: Element = event.currentTarget as Element;
    this.scrollYPos = dom.scrollTop;
    this.scrollXPos = dom.scrollLeft;

    let direction = null;
    if (this.scrollYPos < this.prevScrollYPos) {
      direction = 'up';
    } else if (this.scrollYPos > this.prevScrollYPos) {
      direction = 'down';
    }

    if (this.prevScrollYPos !== this.scrollYPos || this.prevScrollXPos !== this.scrollXPos) {
      if (direction) {
        this.chunkRows();
        let topPadding = this.rowHeight * this.start;
        if (this.rowHeightProp) {
          topPadding = this.rowHeightCache.getRowOffset(this.start - 1);
        }
        requestAnimationFrame(() => {
          this.contentEl.style.transform = `translateY(${topPadding}px)`;
        });
        this.topPadding = topPadding;
        this.bottomPadding = this.scrollLength - this.topPadding - this.scrollHeight;
      }

      this.prevScrollYPos = this.scrollYPos;
      this.prevScrollXPos = this.scrollXPos;

      const eventArgs = {
        direction,
        scrollYPos: this.scrollYPos,
        scrollXPos: this.scrollXPos
      };
      this.dispatchEvent(new CustomEvent<ScrollerEventArgs>('scrollChange', { detail: eventArgs }));
    }
  }

  setOffsetY(offsetY: number) {
    this.scrollTop = offsetY;
  }

  setPageOffsetY(page: number) {
    const rowIndex = this.itemsPerRow * (page - 1);
    let offset = 0;
    if (this.rowHeightProp) {
      offset = this.rowHeightCache.getRowOffset(rowIndex - 1);
    } else {
      offset = this.rowHeight * rowIndex;
    }
    this.setOffsetY(offset);
  }

  private calculateDimensions() {
    if (this.rowHeightProp) {
      this.rowHeightCache.initCache(this.items, this.rowHeightProp);
    }
    if (this.items && this.items.length) {
      const totalRecords = this.items.length;
      if (this.rowHeightProp) {
        this.scrollLength = this.rowHeightCache.calcScrollLength(totalRecords);
      } else {
        this.scrollLength = this.rowHeight * totalRecords;
      }
      this.paddingEl.style.height = this.scrollLength + 'px';
    }
    let scrollHeight = parseFloat(this.style.height);
    if (scrollHeight && this.rowHeight) {
      this.itemsPerRow = Math.round(scrollHeight / this.rowHeight);
    } else {
      scrollHeight = this.itemsPerRow * this.rowHeight;
      if (scrollHeight > 0) {
        scrollHeight -= this.rowHeight; // for lazy load
      }
    }
    this.style.height = scrollHeight + 'px';
  }

  private chunkRows(force: boolean = false) {
    this.calculateDimensions();
    const totalRecords = this.items.length;
    if (this.rowHeightProp) {
      this.start = this.rowHeightCache.calcRowIndex(this.scrollYPos);
    } else {
      this.start = Math.floor(this.scrollYPos / this.rowHeight);
    }
    this.end = Math.min(totalRecords, this.start + this.itemsPerRow);

    if ((this.end - this.start) < this.itemsPerRow) {
      this.start = totalRecords - this.itemsPerRow;
      this.start = Math.max(this.start, 0);
      this.end = totalRecords;
    }
    if (this.start !== this.previousStart || this.end !== this.previousEnd || force === true) {
      const virtualRows = this.items.slice(this.start, this.end);
      this.previousStart = this.start;
      this.previousEnd = this.end;
      this.viewRows = virtualRows;
    }
  }

  resetPosition() {
    this.start = 0;
    this.end = 0;
    this.previousStart = 0;
    this.previousEnd = 0;
  }

}

customElements.define('web-scroller', ScrollerComponent);
