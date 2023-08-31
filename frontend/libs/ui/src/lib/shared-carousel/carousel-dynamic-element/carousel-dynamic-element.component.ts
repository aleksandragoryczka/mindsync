import { Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CarouselSlideComponent } from '../../carousel-slide/carousel-slide.component';

@Component({
  selector: 'project-carousel-dynamic-element',
  template: `<div #container><ng-content></ng-content></div>`,
})
export class CarouselDynamicElementComponent {
  private _elements: CarouselSlideComponent[] = [];
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  public addComponent(
    ngItem: Type<CarouselSlideComponent>,
    _data: any
  ): CarouselSlideComponent {
    const ref = this.container.createComponent(ngItem);
    ref.instance.data = _data;
    const newItem: CarouselSlideComponent = ref.instance;
    this._elements.push(newItem);
    return newItem;
  }

  resetContainer() {
    this._elements = [];
  }
}
