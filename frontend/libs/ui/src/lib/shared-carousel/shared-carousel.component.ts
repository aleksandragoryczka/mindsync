import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { CarouselDynamicElementComponent } from './carousel-dynamic-element/carousel-dynamic-element.component';
import { CardSlideComponent } from '../carousel-slide/card-slide/card-slide.component';
import { CarouselSlideComponent } from '../carousel-slide/carousel-slide.component';
import { SlideComponent } from '../carousel-slide/slide/slide.component';

@Component({
  selector: 'project-shared-carousel',
  templateUrl: './shared-carousel.component.html',
  styleUrls: ['./shared-carousel.component.scss'],
})
export class SharedCarouselComponent implements AfterViewInit {
  @Input() slideConfig!: object;
  @Input() data!: any[];
  @Input() slideType!: string;
  public elements: Array<{ view: ViewRef; component: CarouselSlideComponent }> =
    [];
  private SlideTypes: any = {
    CardSlide: CardSlideComponent,
    Slide: SlideComponent,
  };
  @ViewChild(CarouselDynamicElementComponent)
  carouselDynamicElementComponent!: CarouselDynamicElementComponent;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.data.forEach(item => {
      const component = this.carouselDynamicElementComponent.addComponent(
        this.SlideTypes[this.slideType],
        item
      );
      component.data = item;
      const view: ViewRef | null =
        this.carouselDynamicElementComponent.container.detach(0);
      if (view) this.elements.push({ view, component });
    });
    this.carouselDynamicElementComponent.resetContainer();
  }
}
