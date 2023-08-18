import { Component, Input } from '@angular/core';
import { PresentationModel } from '../../../../shared/src/lib/models/presentation.model';
import StringFormater from '../../../../shared/src/lib/utils/string-formater';

@Component({
  selector: 'project-shared-card',
  templateUrl: './shared-card.component.html',
  styleUrls: ['./shared-card.component.scss'],
})
export class SharedCardComponent {
  @Input() data!: PresentationModel;
  stringFormater = StringFormater;

  showPresentationButton() {
    console.log('');
  }
}
