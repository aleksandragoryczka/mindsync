import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScreenshotModel } from 'libs/shared/src/lib/models/screenshot.model';
import * as JSZip from 'jszip';
import * as saveAs from 'file-saver';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'project-screenshots',
  templateUrl: './screenshots.component.html',
  styleUrls: ['./screenshots.component.scss'],
})
export class ScreenshotsComponent {
  currentImageIndex = 0;

  public constructor(
    private dialogRef: MatDialogRef<ScreenshotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScreenshotModel[],
    private toastrService: ToastrService
  ) {}

  closePopup(): void {
    this.dialogRef.close();
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) this.currentImageIndex--;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.data.length - 1) this.currentImageIndex++;
  }

  downloadScreenshots(): void {
    const zip = new JSZip();
    const imageFolder = zip.folder('screenshots');
    this.data.forEach(screenshot => {
      const imageData = screenshot.picture;
      const imageTitle = `screenshot_${screenshot.id}.png`;
      imageFolder?.file(imageTitle, imageData, { base64: true });
    });
    zip.generateAsync({ type: 'blob' }).then(
      blob => {
        saveAs(blob, 'screenshots.zip');
      },
      error =>
        this.toastrService.error(
          'An error occured while downloading screenshots',
          'Error'
        )
    );
  }
}
