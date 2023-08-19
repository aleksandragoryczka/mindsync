import { Component } from '@angular/core';

@Component({
  selector: 'project-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.scss'],
})
export class PresentationDetailsComponent {
  slides = [1, 2, 3, 4, 5];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };
}
