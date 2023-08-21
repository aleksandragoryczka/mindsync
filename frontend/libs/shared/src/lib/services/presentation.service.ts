import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result.model';
import { PresentationModel } from '../models/presentation.model';
import { environment } from 'apps/mindsync/src/environments/environment.development';
import { PresentationWithShows } from '../models/presentation-with-shows.model';

@Injectable({ providedIn: 'root' })
export class PresentationService {
  constructor(private http: HttpClient) {}

  getPresentationsForUser(): Observable<PaginatedResult<PresentationModel>> {
    return this.http.get<PaginatedResult<PresentationModel>>(
      `${environment.apiUrl}/user/presentations`
    );
  }

  getPresentationsWithShows(
    id: string,
    page = 0,
    size = 10
  ): Observable<PresentationWithShows> {
    return this.http.get<PresentationWithShows>(
      `${environment.apiUrl}/presentation/${id}/shows?page=${
        page * size
      }&size=${size}`
    );
  }
}
