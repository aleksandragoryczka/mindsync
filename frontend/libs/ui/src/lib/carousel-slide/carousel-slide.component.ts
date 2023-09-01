import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'project-carousel-slide',
  template: `<ng-content></ng-content>`,
})
export class CarouselSlideComponent implements OnInit {
  @Input() data!: any;
  constructor(protected _ngEl: ElementRef, protected _renderer: Renderer2) {}

  ngOnInit(): void {
    this._renderer.addClass(this._ngEl.nativeElement, 'project-carousel-slide');
  }

  public get element(): any {
    return this._ngEl.nativeElement;
  }
}
