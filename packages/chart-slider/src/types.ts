export interface ChartInterval {
  dtFrom: Date;
  dtTo: Date;
  label: string;
  color: string;
}

export interface AxisLabel {
  name: string;
  widthPercent: number;
  positionPercent: number;
}

export interface ChartSliderData {
  widthPercent: number;
  positionPercent: number;
  items: ChartSliderDataItem[];
}

export interface ChartSliderDataItem {
  heightPercent: number;
  label: string;
  color: string;
}

export interface ChartSliderHandleDates {
  dateFrom: Date;
  dateTo: Date;
}

export interface ChartSliderResizableEvent {
  width: number;
  left?: number;
}
