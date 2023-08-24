import {
  Component,
  ComponentRef,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { SharedCardComponent } from '../shared-card/shared-card.component';
import { SharedTableComponent } from '../shared-table/shared-table.component';
import { OnInit } from '@angular/core';

@Component({
  selector: 'project-shared-carousel',
  templateUrl: './shared-carousel.component.html',
  styleUrls: ['./shared-carousel.component.scss'],
})
export class SharedCarouselComponent implements OnInit {
  @Input() slideConfig!: object;
  @Input() data!: any[];
  @Input() slideType!: string;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {
    console.log(this.slideType);
    this.loadCarouselItems();
  }

  private loadCarouselItems(): void {
    this.viewContainerRef.clear();
    const componentType = this.checkSlideType();
    //console.log(typeof componentType);
    console.log(this.data);
    this.data.forEach(item => {
      const componetRef = this.viewContainerRef.createComponent(componentType);
      componetRef.instance.data = item;
    });
  }

  private checkSlideType() {
    if (this.slideType === 'sharedCard') return SharedCardComponent;
    return SharedCardComponent;
  }
}
