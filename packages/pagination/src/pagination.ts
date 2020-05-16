export class Pagination {

  static getTotalPages(totalItems: number, perPage: number): number {
    const totalPages = perPage < 1 ? 1 : Math.ceil(totalItems / perPage);
    return Math.max(totalPages || 0, 1);
  }

  static getPages(currentPage: number, totalPages: number): number[] {
    const maxSize = 3;
    const pages: number[] = [];
    let startPage = 1;
    let endPage = totalPages;

    if (maxSize < totalPages) {
      startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
      endPage = startPage + maxSize - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxSize + 1;
      }
    }
    for (let num = startPage; num <= endPage; num++) {
      pages.push(num);
    }
    return pages;
  }

  static getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 of ${length}`; }

    length = Math.max(length, 0);

    const startIndex = (page - 1) * pageSize;

    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} of ${length}`;
  }

}
