import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { PresentationModel } from '../../../../../libs/shared/src/lib/models/presentation.model';
import { PresentationService } from '../../../../../libs/shared/src/lib/services/presentation.service';
import { PaginatedResult } from 'libs/shared/src/lib/models/paginated-result.model';

@Component({
  selector: 'project-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  currentPage$ = new BehaviorSubject<number>(0);
  totalNumberOfPages = 1;
  pageSize = 4;
  listOfPresentations$: Observable<PresentationModel[]> =
    this.loadPresentations();

  constructor(private presentationService: PresentationService) {}

  getVisiblePresentations(
    presentations: PresentationModel[],
    page: number
  ): PresentationModel[] {
    const startIndex = page * this.pageSize;
    return presentations.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage$.value < this.totalNumberOfPages - 1) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }
  previousPage(): void {
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  trackByPresentationId(
    index: number,
    presentation: PresentationModel
  ): string {
    return presentation.id || '1';
  }

  private loadPresentations(): Observable<PresentationModel[]> {
    console.log('current page value: ' + this.currentPage$.value);
    return this.currentPage$.pipe(
      switchMap(currentPage =>
        this.presentationService.getPresentationsForUser(currentPage)
      ),
      map((res: PaginatedResult<PresentationModel>) => {
        console.log(res);
        this.totalNumberOfPages = res.totalPages;
        //if (res.totalPages === 0 && this.currentPage$.value - 1 >= 0)
        // this.currentPage$.next(this.currentPage$.value - 1);
        return res.content;
      })
    );
  }

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3500,
    infinite: true,
    reponsive: [
      {
        breakpoint: 992,
        settings: {
          arrows: true,
          inifiite: true,
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          inifiite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
}
