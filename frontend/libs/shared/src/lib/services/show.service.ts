import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScreenshotModel } from '../models/screenshot.model';
import { PaginatedResult } from '../models/paginated-result.model';
import { ShowModel } from '../models/show.model';
import { sharedEnvironment } from '../environments/shared-environment';

@Injectable({ providedIn: 'root' })
export class ShowService {
  constructor(private http: HttpClient) {}

  addShow(newShow: FormData, quizId: string): Observable<ShowModel> {
    return this.http.post<ShowModel>(
      `${sharedEnvironment.apiUrl}/show?quizId=${quizId}`,
      newShow
    );
  }

  deleteShow(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${sharedEnvironment.apiUrl}/show/${id}`);
  }

  getExcelFile(id: string): Observable<Blob> {
    return this.http.get(`${sharedEnvironment.apiUrl}/show/${id}/excel`, {
      responseType: 'blob',
    });
  }

  getScreenshotsByShowId(
    id: string
  ): Observable<PaginatedResult<ScreenshotModel>> {
    return this.http.get<PaginatedResult<ScreenshotModel>>(
      `${sharedEnvironment.apiUrl}/show/${id}/screenshots`
    );
  }
}
