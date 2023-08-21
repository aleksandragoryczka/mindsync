import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'project-presentation-details',
  templateUrl: './presentation-details.component.html',
  styleUrls: ['./presentation-details.component.scss'],
})
export class PresentationDetailsComponent implements OnInit {
  slides = [1, 2, 3, 4, 5];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
  }
}
