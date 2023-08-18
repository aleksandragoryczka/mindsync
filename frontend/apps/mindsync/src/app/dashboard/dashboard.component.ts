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
  listOfPresentations$: Observable<PresentationModel[]> =
    this.loadPresentations();

  constructor(private presentationService: PresentationService) {}

  private loadPresentations(): Observable<PresentationModel[]> {
    return this.currentPage$.pipe(
      switchMap(currentPage =>
        this.presentationService.getPresentationsForUser(currentPage)
      ),
      map((res: PaginatedResult<PresentationModel>) => {
        return res.content;
      })
    );
  }

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3400,
    infinite: true,
    responsive: [
      {
        breakpoint: 1550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
}
