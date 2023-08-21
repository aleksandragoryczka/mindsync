import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { SharedTableData } from '../../../../../libs/shared/src/lib/models/shared-table-data.model';
import { PresentationService } from '../../../../../libs/shared/src/lib/services/presentation.service';
import { ActivatedRoute } from '@angular/router';
import { PresentationWithShows } from 'libs/shared/src/lib/models/presentation-with-shows.model';
import StringFormater from 'libs/shared/src/lib/utils/string-formater';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { ShowService } from '../../../../../libs/shared/src/lib/services/show.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { ShowModel } from 'libs/shared/src/lib/models/show.model';

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
    private presentationService: PresentationService,
    private dialog: MatDialog,
    private showService: ShowService,
    private toastrService: ToastrService
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

  private deleteShow(id: string): void {
    this.showService.deleteShow(id).subscribe(isDeleted => {
      if (!isDeleted) this.toastrService.warning('Something went wrong');
      else {
        this.listOfShows$ = this.loadShows();
        this.toastrService.success('Show deleted successfully');
      }
    });
  }

  private downloadExcelFile(showId: string, presentationTitle: string): void {
    this.showService.getExcelFile(showId).subscribe(response => {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, presentationTitle);
    });
  }

  private openDeleteOrganizationPopup(id: string): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.deleteShow(id),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Delete show',
      description: 'Are you sure you want to delete that show?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
    });
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
            tooltip: 'Screenshots preview',
          },
          {
            icon: 'cloud_download',
            func: (arg: { showId: string; presentationTitle: string }) => {
              this.downloadExcelFile(arg.showId, arg.presentationTitle);
            },
            arg: { showId: show.id, presentationTitle: data.title },
            tooltip: 'Download summary',
          },
          {
            icon: 'delete',
            func: (arg: string) => {
              this.openDeleteOrganizationPopup(arg);
            },
            arg: show?.id,
            tooltip: 'Delete',
          },
        ],
      };
      results.push(result);
    });
    return results;
  }
}
