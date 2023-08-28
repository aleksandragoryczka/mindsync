import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SlideModel } from 'libs/shared/src/lib/models/slide.model';
import { PresentationService } from 'libs/shared/src/lib/services/presentation.service';
import { Observable, map, tap } from 'rxjs';
import { PresentationModel } from '../../../../../libs/shared/src/lib/models/presentation.model';
import StringFormater from '../../../../../libs/shared/src/lib/utils/string-formater';

@Component({
  selector: 'project-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.scss'],
})
export class PresentationDetailsComponent {
  //listOfSlides$!: Observable<SlideModel[]>;
  presentation!: PresentationModel;
  presentationId: string | null = '';
  slides: SlideModel[] = [];
  stringFormater = StringFormater;

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    dots: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private presentationService: PresentationService
  ) {
    this.presentationId = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.presentationId) {
      this.loadSlides('7'); //TODO" to be delated with this.loadSlides(id)
      //console.log('tutaj' + this.slides);
    }
  }

  private loadSlides(id: string): void {
    this.presentationService.getPresentationWithSlides(id).subscribe(res => {
      this.slides = res.slides;
      const presentation: PresentationModel = {
        title: res.title,
        code: res.code,
        createdAt: res.createdAt,
      };
      this.presentation = presentation;
      //console.log(this.presentation);
      console.log(this.slides);
    });
    //return new Observable<SlideModel[]>();
  }
}
