import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedTableData } from '../../../../shared/src/lib/models/shared-table-data.model';
import SharedNavigation from '../../../../shared/src/lib/utils/shared-navigation';

@Component({
  selector: 'project-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
})
export class SharedTableComponent {
  @Input() caption!: string;
  @Input() headers!: string[];
  @Input() data!: SharedTableData[];
  @Input() currentPage!: number;
  @Input() totalNumberOfPages!: number;
  @Input() rowsPerPage!: number;
  sharedNavigation = SharedNavigation;

  @Output() prevPageEvent = new EventEmitter<number>();
  @Output() nextPageEvent = new EventEmitter<number>();
}
