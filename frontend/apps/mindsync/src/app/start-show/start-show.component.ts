import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StartShowPopupComponent } from './start-show-popup/start-show-popup.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'project-start-show',
  templateUrl: './start-show.component.html',
  styleUrls: ['./start-show.component.scss'],
})
export class StartShowComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.openDialog();
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(StartShowPopupComponent);
  }
}
