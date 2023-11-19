import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { SharedTableData } from '../../../../../libs/shared/src/lib/models/shared-table-data.model';
import { ActivatedRoute } from '@angular/router';
import { QuizWithShows } from 'libs/shared/src/lib/models/quiz-with-shows.model';
import StringFormatter from 'libs/shared/src/lib/utils/string-formatter';
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
import { ScreenshotsComponent } from './screenshots/screenshots.component';
import { ScreenshotModel } from 'libs/shared/src/lib/models/screenshot.model';
import { TooltipTexts } from '../../../../../libs/shared/src/lib/models/enums/tooltips-texts.enum';
import { QuizService } from 'libs/shared/src/lib/services/quiz.service';

@Component({
  selector: 'project-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss'],
})
export class ShowsComponent implements OnInit {
  quizId = '';
  quizTitle = '';
  totalShowsNumberOfPages = 1;
  rowsPerPage = 10;
  caption = '';
  headers = ['Attendees Number', 'Created At'];
  currentPage$ = new BehaviorSubject<number>(0);
  listOfShows$: Observable<SharedTableData[]> = this.loadShows();

  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
    private dialog: MatDialog,
    private showService: ShowService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.quizTitle =
      this.activatedRoute.snapshot.queryParamMap.get('title') ?? '';
    if (id != null) this.quizId = id;
  }

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }

  private deleteShow(id: string): void {
    this.showService.deleteShow(id).subscribe(isDeleted => {
      if (isDeleted) {
        this.dialog.closeAll();
        this.listOfShows$ = this.loadShows();
        this.toastrService.success('Show deleted successfully');
      } else this.toastrService.warning('Something went wrong');
    });
  }

  private downloadExcelFile(showId: string, quizTitle: string): void {
    this.showService.getExcelFile(showId).subscribe(
      response => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, quizTitle);
      },
      error => {
        this.toastrService.error(
          'An error occured while downloading the summary Excel file',
          'Error'
        );
      }
    );
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
        this.quizService.getQuizzesWithShows(this.quizId, currentPage)
      ),
      map((res: QuizWithShows) => {
        this.totalShowsNumberOfPages = res.shows.totalPages ?? 1;
        if (res.shows.content.length === 0 && this.currentPage$.value - 1 >= 0)
          this.currentPage$.next(this.currentPage$.value - 1);
        return this.mapData(res);
      })
    );
  }

  openScreenshotsShowPreview(id: string): void {
    this.showService.getScreenshotsByShowId(id).subscribe(response => {
      const mappedScreenshots: ScreenshotModel[] = response.content.map(
        screenshot => {
          return {
            id: screenshot.id,
            picture: screenshot.picture,
          };
        }
      );
      this.dialog.open(ScreenshotsComponent, { data: mappedScreenshots });
    });
  }

  private mapData(data: QuizWithShows): SharedTableData[] {
    const shows = data.shows.content;
    this.rowsPerPage = data.shows.size ?? 10;
    const results: SharedTableData[] = [];
    shows.forEach(show => {
      const result: SharedTableData = {
        cols: [
          show.attendeesNumber,
          StringFormatter.getDateFromISOString(show.createdAt),
        ],
        actions: [
          {
            icon: 'photo',
            func: (arg: string) => {
              this.openScreenshotsShowPreview(arg);
            },
            arg: show?.id,
            tooltip: TooltipTexts.screenshotsPreview,
          },
          {
            icon: 'cloud_download',
            func: (arg: { showId: string; quizTitle: string }) => {
              this.downloadExcelFile(arg.showId, arg.quizTitle);
            },
            arg: { showId: show.id, quizTitle: data.title },
            tooltip: TooltipTexts.downloadShowSummary,
          },
          {
            icon: 'delete',
            func: (arg: string) => {
              this.openDeleteOrganizationPopup(arg);
            },
            arg: show?.id,
            tooltip: TooltipTexts.delete,
          },
        ],
      };
      results.push(result);
    });
    return results;
  }
}
