export function arrayMove<T = any>(array: T[], fromIndex: number, toIndex: number): T {
  fromIndex = clamp(fromIndex, array.length - 1);
  toIndex = clamp(toIndex, array.length - 1);

  if (fromIndex !== toIndex) {
    const fromItem = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, fromItem);
    return fromItem;
  }
}

export function arrayTransfer<T = any>(arrayFrom: T[], arrayTo: T[], fromIndex: number, toIndex: number): T {
  fromIndex = clamp(fromIndex, arrayFrom.length - 1);
  toIndex = clamp(toIndex, arrayTo.length);

  if (arrayFrom.length) {
    const fromItem = arrayFrom.splice(fromIndex, 1)[0];
    arrayTo.splice(toIndex, 0, fromItem);
    return fromItem;
  }
}

function clamp(a: number, b: number): number {
  return Math.max(0, Math.min(a, b));
}

export function arrayPaginate<T = any>(array: T[], currentPage: number, perPage: number): T[] {
  if (!array || !currentPage || !perPage) {
    return array;
  }
  const start = (currentPage - 1) * perPage;
  const end = perPage > -1 ? (start + perPage) : array.length;
  return array.slice(start, end);
}
