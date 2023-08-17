import { Component } from '@angular/core';
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
  //presentations = [1, 2, 3, 4, 5, 6];
  currentPage$ = new BehaviorSubject<number>(0);
  totalNumberOfPages = 1;
  listOfPresentations$: Observable<PresentationModel[]> =
    this.loadPresentations();

  constructor(private presentationService: PresentationService) {}

  private loadPresentations(): Observable<PresentationModel[]> {
    return this.currentPage$.pipe(
      switchMap(currentPage =>
        this.presentationService.getPresentationsForUser(currentPage)
      ),
      map((res: PaginatedResult<PresentationModel>) => {
        console.log(res);
        this.totalNumberOfPages = res.totalPages;
        if (res.totalPages === 0 && this.currentPage$.value - 1 >= 0)
          this.currentPage$.next(this.currentPage$.value - 1);
        return res.content;
      })
    );
  }
}
