import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { SharedTableData } from '../../../../../libs/shared/src/lib/models/shared-table-data.model';
import { PresentationService } from '../../../../../libs/shared/src/lib/services/presentation.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult } from 'libs/shared/src/lib/models/paginated-result.model';
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
  caption = '';
  headers = ['Attendees Number', 'Created At'];
  currentPage$ = new BehaviorSubject<number>(0);
  //stringFormater = StringFormater;
  listOfShows$: Observable<SharedTableData[]> = this.loadShows();

  constructor(
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) this.presentationId = id;
    this.loadShows().subscribe();
  }

  private loadShows() {
    return this.currentPage$.pipe(
      switchMap(currentPage =>
        this.presentationService.getPresentationsWithShows('1', currentPage)
      ),
      map((res: PresentationWithShows) => {
        return this.mapData(res);
      })
    );
  }

  private mapData(data: PresentationWithShows): SharedTableData[] {
    const shows = data.shows.content;
    this.totalShowsNumberOfPages = data.shows.totalPages ?? 1;
    this.caption = data.title ?? '';
    const results: SharedTableData[] = [];
    shows.forEach(show => {
      const result: SharedTableData = {
        cols: [
          show.attendeesNumber,
          StringFormater.getDateFromISOString(show.createdAt),
        ],
        actions: [
          {
            icon: 'delete',
            func: (arg: string) => {
              console.log(arg);
            },
            arg: show,
            tooltip: 'delete',
          },
          {
            icon: 'cloud_download',
            func: (arg: string) => {
              console.log(arg);
            },
            arg: show,
            tooltip: 'sssss',
          },
        ],
      };
      results.push(result);
    });
    return results;
  }
}
