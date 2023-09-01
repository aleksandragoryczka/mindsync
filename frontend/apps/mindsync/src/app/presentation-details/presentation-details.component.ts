import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { PresentationModel } from '../../../../../libs/shared/src/lib/models/presentation.model';
import StringFormatter from '../../../../../libs/shared/src/lib/utils/string-formatter';
import { PresentationWithSlides } from 'libs/shared/src/lib/models/presentation-with-slides.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupFullDataModel,
  InputPopupModel,
} from 'libs/shared/src/lib/models/input-popup-data.model';
import { PopupWithInputsComponent } from 'libs/ui/src/lib/popup-with-inputs/popup-with-inputs.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'project-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.scss'],
})
export class PresentationDetailsComponent {
  listOfSlides$: Observable<SlideModel[]> = EMPTY;
  presentation: PresentationModel = { title: '', code: '', createdAt: '' };
  presentationId = this.activatedRoute.snapshot.paramMap.get('id');
  slides: SlideModel[] = [];
  StringFormatter = StringFormatter;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    dots: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (this.presentationId) {
      this.listOfSlides$ = this.loadSlides(this.presentationId); //TODO: to be replaced with 'id'
      //console.log(this.listOfSlides$);
    }
  }

  openDeletePresentationPopup(): void {
    const inputs: Record<string, InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.deletePresentation(),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'No',
      },
    ];
    const data: InputPopupFullDataModel = {
      title: 'Delete presentation',
      description: 'Are you sure you want to delete that presentation?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
    });
  }

  private deletePresentation(): void {
    if (this.presentationId) {
      this.presentationService
        .deletePresentation(this.presentationId)
        .subscribe(isDeleted => {
          if (!isDeleted) this.toastrService.warning('Something went wrong');
          else {
            this.dialog.closeAll();
            this.router.navigateByUrl('/dashboard');
            this.toastrService.success('Show deleted successfully');
          }
        });
    }
  }

  private loadSlides(id: string): Observable<SlideModel[]> {
    return this.presentationService.getPresentationWithSlides(id).pipe(
      tap((res: PresentationWithSlides) => {
        const presentation: PresentationModel = {
          title: res.title,
          code: res.code,
          createdAt: res.createdAt,
        };
        this.presentation = presentation;
      }),
      map((res: PresentationWithSlides) => res.slides)
    );
  }
}
