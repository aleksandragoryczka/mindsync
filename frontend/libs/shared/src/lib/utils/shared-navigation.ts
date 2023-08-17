import { EventEmitter } from '@angular/core';

export default class SharedNavigation {
  static prevPage(
    currentPage: number,
    prevPageEvent: EventEmitter<number>
  ): void {
    if (currentPage > 0) prevPageEvent.emit(--currentPage);
  }

  static nextPage(
    currentPage: number,
    nextPageEvent: EventEmitter<number>,
    totalNumberOfPages: number
  ): void {
    if (currentPage < totalNumberOfPages - 1) nextPageEvent.emit(++currentPage);
  }

  static getStartRowIndex(currrentPage: number, rowPerPage: number): number {
    return currrentPage * rowPerPage + 1;
  }
}
