import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { SharedTableData } from '../../../../../libs/shared/src/lib/models/shared-table-data.model';
import { PresentationService } from '../../../../../libs/shared/src/lib/services/presentation.service';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithShows } from 'libs/shared/src/lib/models/presentation-with-shows.model';
import StringFormater from 'libs/shared/src/lib/utils/string-formater';

@Component({
  selector: 'project-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss'],
})
export class ShowsComponent implements OnInit {
  presentationId = '';
  totalShowsNumberOfPages = 1;
  rowsPerPage = 10;
  caption = '';
  headers = ['Attendees Number', 'Created At'];
  currentPage$ = new BehaviorSubject<number>(0);
  listOfShows$: Observable<SharedTableData[]> = this.loadShows();

  constructor(
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) this.presentationId = id;
    this.presentationId = '1'; //to be deleted
    //this.loadShows().subscribe();
  }

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }

  private loadShows(): Observable<SharedTableData[]> {
    return this.currentPage$.pipe(
      switchMap(currentPage =>
        this.presentationService.getPresentationsWithShows(
          this.presentationId,
          currentPage
        )
      ),
      map((res: PresentationWithShows) => {
        this.totalShowsNumberOfPages = res.shows.totalPages ?? 1;
        if (res.shows.content.length === 0 && this.currentPage$.value - 1 >= 0)
          this.currentPage$.next(this.currentPage$.value - 1);
        return this.mapData(res);
      })
    );
  }

  private mapData(data: PresentationWithShows): SharedTableData[] {
    const shows = data.shows.content;
    this.rowsPerPage = data.shows.size ?? 10;
    const results: SharedTableData[] = [];
    shows.forEach(show => {
      const result: SharedTableData = {
        cols: [
          show.attendeesNumber,
          StringFormater.getDateFromISOString(show.createdAt),
        ],
        actions: [
          {
            icon: 'slideshow',
            func: (arg: string) => {
              console.log(arg);
            },
            arg: show,
            tooltip: 'Show screenshots',
          },
          {
            icon: 'cloud_download',
            func: (arg: string) => {
              console.log(arg);
            },
            arg: show,
            tooltip: 'Download summary',
          },
          {
            icon: 'delete',
            func: (arg: string) => {
              console.log(arg);
            },
            arg: show,
            tooltip: 'Delete',
          },
        ],
      };
      results.push(result);
    });
    console.log(results);
    return results;
  }
}
