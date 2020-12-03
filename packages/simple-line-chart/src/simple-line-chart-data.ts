export interface SimpleLineChartData {
  x: number;
  y: number;
}

export function createD(data: SimpleLineChartData[], width: number, height: number): string {
  const values = prepareData(data, width, height);
  return values.reduce((d, point, index) => index ? `${d} L ${point}` : `M ${point}`, '');
}

function prepareData(data: SimpleLineChartData[], width: number, height: number): [number, number][] {
  const x = data.map(obj => obj.x);
  const y = data.map(obj => obj.y);

  const maxX = Math.max(...x);
  const maxY = Math.max(...y);
  const padding = 1;

  return data.map(obj => [
    calcX(obj.x, width, maxX) + padding,
    calcY(obj.y, height, maxY) + padding
  ]);
}

function calcX(x: number, width: number, maxX: number): number {
  return (x / maxX) * width;
}

function calcY(y: number, height: number, maxY: number): number {
  return height - (y / maxY) * height;
}

export function createVerticalGuides(width: number, height: number, padding: number): string[] {
  const guideCount = 4;
  const startY = padding;
  const endY = height - padding;

  return new Array(guideCount - 1).fill(0).map((val, index) => {
    const ratio = (index + 1) / guideCount;
    const xCoordinate = padding + ratio * (width - padding * 2);
    return `${xCoordinate},${startY} ${xCoordinate},${endY}`;
  });
}

export function createHorizontalGuides(width: number, height: number, padding: number): string[] {
  const guideCount = 4;
  const startX = padding;
  const endX = width - padding;

  return new Array(guideCount - 1).fill(0).map((val, index) => {
    const ratio = (index + 1) / guideCount;
    const yCoordinate = height - height * ratio + padding;
    return `${startX},${yCoordinate} ${endX},${yCoordinate}`;
  });
}
