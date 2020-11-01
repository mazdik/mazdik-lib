import { ChartInterval, AxisLabel, ChartSliderData, ChartSliderHandleDates } from './types';
import { toISOStringIgnoreTZ } from '@mazdik-lib/common';

export function createChartSliderData(beginDate: Date, endDate: Date, intervals: ChartInterval[]): ChartSliderData[] {
  const data: ChartSliderData[] = [];
  if (!intervals || intervals.length === 0) {
    return [];
  }
  const diffTime = getDiffTime(beginDate, endDate);
  const dtFroms = intervals.map(x => x.dtFrom);
  const dtTos = intervals.map(x => x.dtTo);
  const dates = dtFroms.concat(dtTos);
  const uniqueDates = dates.filter((v, i, a) => a.findIndex(d => d.getTime() === v.getTime()) === i);
  uniqueDates.sort((a, b) => a.getTime() - b.getTime());
  uniqueDates.forEach((dt, index) => {
    let dtFrom = dt;
    let dtTo = uniqueDates[index + 1] ? uniqueDates[index + 1] : endDate;

    if (dtFrom < beginDate) {
      dtFrom = beginDate;
    }
    if (dtTo > endDate) {
      dtTo = endDate;
    }
    const items = intervals.filter(x => x.dtFrom < dtTo && x.dtTo > dtFrom);

    const chartSliderDataItem = items.map(x => {
      return {
        heightPercent: Math.round((100 / items.length) * 100) / 100,
        color: x.color,
        label: x.label
      }
    });

    const time = getDiffTime(dtFrom, dtTo);
    const line: ChartSliderData = {
      widthPercent: (time / diffTime) * 100,
      positionPercent: 100 - (getDiffTime(dtFrom, endDate) / diffTime) * 100,
      items: chartSliderDataItem
    };
    if (time > 0 && items.length) {
      data.push(line);
    }
  });

  return data;
}

export function getDiffTime(dateFrom: Date, dateTo: Date): number {
  return (dateTo.getTime() - dateFrom.getTime()) / 1000;
}

export function createXAxisLabels(dateFrom: Date, dateTo: Date, countLabels: number, zoom: number): AxisLabel[] {
  const count = Math.round(countLabels * zoom);
  const diffTime = getDiffTime(dateFrom, dateTo);
  const interval = diffTime / count;
  const percent = (interval / diffTime) * 100;

  let widthPercent = (1 / count * 0.9) * 100;
  widthPercent = Math.round(widthPercent * 100) / 100;

  const xAxisLabels = [];
  for (let index = 0; index <= count; index++) {
    const itemDtFrom = new Date(dateFrom.getTime() + interval * 1000 * index);
    const val: AxisLabel = {
      widthPercent: (index === count) ? null : widthPercent,
      positionPercent: percent * index,
      name: createLabel(dateFrom, dateTo, itemDtFrom, zoom),
    };
    xAxisLabels.push(val);
  }
  return xAxisLabels;
}

function createLabel(dateFrom: Date, dateTo: Date, date: Date, zoom: number): string {
  const dateStringFull = (dt: Date) => dt.toLocaleDateString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const dateStringDay = (dt: Date) => dt.toLocaleDateString([], { month: '2-digit', day: '2-digit' });
  const dayTime = 86400;
  const diffTime = getDiffTime(dateFrom, dateTo);
  const dateString = toISOStringIgnoreTZ(date);
  if (diffTime <= dayTime) {
    const hours = dateString.substr(11, 5);
    return (hours === '00:00' && getDiffTime(dateFrom, date) === dayTime) ? '24:00' : hours;
  } else if (diffTime > dayTime && diffTime <= (dayTime * 4)) {
    return dateStringFull(date);
  } else if (zoom > 1) {
    return dateStringFull(date);
  } else {
    return dateStringDay(date);
  }
}

export function getMinMaxHandleTimes(dateFrom: Date, dateTo: Date, multiplier: number): [number, number] {
  const dayTime = 86400;
  const diffTime = getDiffTime(dateFrom, dateTo);
  let minTime = 0;
  if (diffTime <= dayTime) {
    minTime = 3600;
  } else if (diffTime > dayTime && diffTime <= (dayTime * multiplier * 2)) {
    minTime = 3600;
  } else {
    minTime = dayTime;
  }
  return [minTime, minTime * multiplier];
}

function calcDates(dateFrom: Date, dateTo: Date, percentFrom: number, percentTo: number): ChartSliderHandleDates {
  const diffTime = getDiffTime(dateFrom, dateTo);
  const intervalFrom = (percentFrom * diffTime) / 100;
  const intervalTo = (percentTo * diffTime) / 100;
  const dtFrom = new Date(dateFrom.getTime() + intervalFrom * 1000);
  const dtTo = new Date(dateFrom.getTime() + intervalTo * 1000);
  return { dateFrom: dtFrom, dateTo: dtTo };
}

export function calcHandleDates(dateFrom: Date, dateTo: Date, percentFrom: number, percentTo: number): ChartSliderHandleDates {
  const dayTime = 86400;
  const diffTime = getDiffTime(dateFrom, dateTo);
  let result = calcDates(dateFrom, dateTo, percentFrom, percentTo);
  if (diffTime > (dayTime * 15)) {
    result = {
      dateFrom: roundMinutes(result.dateFrom),
      dateTo: roundMinutes(result.dateTo)
    };
  }
  return result;
}

export function calcDatePercentage(dateFrom: Date, dateTo: Date, time: number): number {
  const diffTime = getDiffTime(dateFrom, dateTo);
  const percent = (time / diffTime) * 100;
  return Math.round(percent * 100) / 100;
}

export function roundMinutes(date: Date): Date {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0);
  return date;
}

export function calcPositionPercent(dateFrom: Date, dateTo: Date, date: Date, handleWidthPerc: number): number {
  const diffTime = getDiffTime(dateFrom, date);
  let percent = calcDatePercentage(dateFrom, dateTo, diffTime);
  if ((percent + handleWidthPerc) > 100) {
    percent = 100 - handleWidthPerc;
  }
  percent = Math.max(0, Math.min(percent, 100));
  return percent;
}
