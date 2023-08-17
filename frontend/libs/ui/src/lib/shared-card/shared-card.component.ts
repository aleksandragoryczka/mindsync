import { Component, Input } from '@angular/core';
import { PresentationModel } from '../../../../shared/src/lib/models/presentation.model';

@Component({
  selector: 'project-shared-card',
  templateUrl: './shared-card.component.html',
  styleUrls: ['./shared-card.component.scss'],
})
export class SharedCardComponent {
  @Input() data!: PresentationModel;

  showPresentationButton() {
    console.log('');
  }
}
