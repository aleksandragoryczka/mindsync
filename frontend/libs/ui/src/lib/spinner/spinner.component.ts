import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../../../../shared/src/lib/services/loader.service';

@Component({
  selector: 'project-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SpinnerComponent {
  constructor(public loader: LoaderService) {}
}
