import { RowHeightCache } from './row-height-cache';
import { ScrollerEventArgs } from './types';
import { isBlank } from '@mazdik-lib/common';

export class VirtualScroller {

  get items(): any[] { return this._items; }
  set items(val: any[]) {
    this._items = val;
    this.initChunkRows();
  }
  private _items: any[];

  appendHeight: number = 0;

  private scrollYPos: number = 0;
  private scrollXPos: number = 0;
  private prevScrollYPos: number = 0;
  private prevScrollXPos: number = 0;
  private scrollLength: number;
  private start: number;
  private end: number;
  private previousStart: number;
  private previousEnd: number;
  private rowHeightCache: RowHeightCache = new RowHeightCache();
  private scrollListener: any;
  private paddingEl: HTMLElement;

  constructor(
    private scrollElement: HTMLElement,
    private contentElement: HTMLElement,
    private rowHeight: number,
    private itemsPerRow: number = 20,
    private rowHeightProp?: string) {
    this.onInit();
  }

  destroy() {
    this.removeEventListeners();
  }

  private removeEventListeners() {
    this.scrollElement.removeEventListener('scroll', this.scrollListener);
  }

  private onInit() {
    this.scrollElement.classList.add('dt-virtual-scroll');
    this.contentElement.classList.add('dt-scrollable-content');

    this.paddingEl = document.createElement('div');
    this.paddingEl.classList.add('dt-total-padding');
    this.scrollElement.append(this.paddingEl);

    this.scrollListener = this.onScrolled.bind(this);
    this.scrollElement.addEventListener('scroll', this.scrollListener);
  }

  private initChunkRows() {
    if (!isBlank(this.items) && !isBlank(this.rowHeight)) {
      this.resetPosition();
      this.chunkRows(true);
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
          this.contentElement.style.transform = `translateY(${topPadding}px)`;
        });
      }

      this.prevScrollYPos = this.scrollYPos;
      this.prevScrollXPos = this.scrollXPos;

      const eventArgs = {
        direction,
        scrollYPos: this.scrollYPos,
        scrollXPos: this.scrollXPos
      };
      this.scrollElement.dispatchEvent(new CustomEvent<ScrollerEventArgs>('scrollChange', { detail: eventArgs }));
    }
  }

  setOffsetY(offsetY: number) {
    this.scrollElement.scrollTop = offsetY;
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
    let scrollHeight = this.scrollElement.offsetHeight;
    if (scrollHeight && this.rowHeight) {
      this.itemsPerRow = Math.round(scrollHeight / this.rowHeight);
    } else {
      scrollHeight = (this.itemsPerRow * this.rowHeight) + this.appendHeight;
      if (scrollHeight > 0) {
        scrollHeight -= this.rowHeight; // for lazy load
      }
      this.scrollElement.style.height = scrollHeight + 'px';
    }
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
      this.scrollElement.dispatchEvent(new CustomEvent('viewRowsChange', { detail: virtualRows }));
    }
  }

  resetPosition() {
    this.start = 0;
    this.end = 0;
    this.previousStart = 0;
    this.previousEnd = 0;
  }

  calcPage(): number {
    return Math.ceil(this.start / this.itemsPerRow) + 1;
  }

}
