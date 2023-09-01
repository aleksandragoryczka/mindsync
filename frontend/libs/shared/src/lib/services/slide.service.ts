import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SlideModel } from '../models/slide.model';
import { Observable } from 'rxjs';
import { environment } from 'apps/mindsync/src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SlideService {
  constructor(private http: HttpClient) {}

  addSlide(
    newSlide: SlideModel,
    presentationId: string
  ): Observable<SlideModel> {
    return this.http.post<SlideModel>(
      `${environment.apiUrl}/slide/${presentationId}`,
      newSlide
    );
  }

  updateSlide(
    updatedSlide: SlideModel,
    slideId: string
  ): Observable<SlideModel> {
    return this.http.put<SlideModel>(
      `${environment.apiUrl}/slide/${slideId}`,
      updatedSlide
    );
  }

  deleteSlide(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/slide/${id}`);
  }
}
