import { Component, Input } from '@angular/core';
import { PresentationModel } from '../../../../shared/src/lib/models/presentation.model';
import StringFormater from '../../../../shared/src/lib/utils/string-formater';
import { Router } from '@angular/router';

@Component({
  selector: 'project-shared-card',
  templateUrl: './shared-card.component.html',
  styleUrls: ['./shared-card.component.scss'],
})
export class SharedCardComponent {
  @Input() data!: PresentationModel;
  stringFormater = StringFormater;

  constructor(private router: Router) {}

  async getDetailsButton(): Promise<void> {
    await this.router.navigate([`/presentation/${this.data.id}`]);
  }

  async getShowsButton() {
    await this.router.navigate([`/presentation/${this.data.id}/shows`]);
  }
}
