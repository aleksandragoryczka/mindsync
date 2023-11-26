import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SlideModel } from '../models/slide.model';
import { Observable } from 'rxjs';
import { sharedEnvironment } from '../environments/shared-environment';

@Injectable({ providedIn: 'root' })
export class SlideService {
  constructor(private http: HttpClient) {}

  addSlide(newSlide: SlideModel, quizId: string): Observable<SlideModel> {
    return this.http.post<SlideModel>(
      `${sharedEnvironment.apiUrl}/slide/${quizId}`,
      newSlide
    );
  }

  updateSlide(
    updatedSlide: SlideModel,
    slideId: string
  ): Observable<SlideModel> {
    return this.http.put<SlideModel>(
      `${sharedEnvironment.apiUrl}/slide/${slideId}`,
      updatedSlide
    );
  }

  deleteSlide(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${sharedEnvironment.apiUrl}/slide/${id}`);
  }
}
