import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'apps/mindsync/src/environments/environment.development';
import { ScreenshotModel } from '../models/screenshot.model';
import { PaginatedResult } from '../models/paginated-result.model';
import { ShowModel } from '../models/show.model';

@Injectable({ providedIn: 'root' })
export class ShowService {
  constructor(private http: HttpClient) {}

  addShow(newShow: FormData, quizId: string): Observable<ShowModel> {
    return this.http.post<ShowModel>(
      `${environment.apiUrl}/show?quizId=${quizId}`,
      newShow
    );
  }

  deleteShow(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/show/${id}`);
  }

  getExcelFile(id: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/show/${id}/excel`, {
      responseType: 'blob',
    });
  }

  getScreenshotsByShowId(
    id: string
  ): Observable<PaginatedResult<ScreenshotModel>> {
    return this.http.get<PaginatedResult<ScreenshotModel>>(
      `${environment.apiUrl}/show/${id}/screenshots`
    );
  }
}
