import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result.model';
import { PresentationModel } from '../models/presentation.model';
import { environment } from 'apps/mindsync/src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class PresentationService {
  constructor(private http: HttpClient) {}

  getPresentationsForUser(
    page = 0,
    size = 30
  ): Observable<PaginatedResult<PresentationModel>> {
    return this.http.get<PaginatedResult<PresentationModel>>(
      `${environment.apiUrl}/user/presentations?page=${page}&size=${size}`
    );
  }
}
