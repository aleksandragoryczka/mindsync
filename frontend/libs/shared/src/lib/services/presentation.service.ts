import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result.model';
import { PresentationModel } from '../models/presentation.model';
import { environment } from 'apps/mindsync/src/environments/environment.development';
import { PresentationWithShows } from '../models/presentation-with-shows.model';
import { PresentationWithSlides } from '../models/presentation-with-slides.model';
import { UserWithPresentationsCountModel } from '../models/user-with-presentations-count.model';

@Injectable({ providedIn: 'root' })
export class PresentationService {
  constructor(private http: HttpClient) {}

  addPresentation(newPresentation: FormData): Observable<PresentationModel> {
    return this.http.post<PresentationModel>(
      `${environment.apiUrl}/presentation`,
      newPresentation
    );
  }

  getPresentationsForUser(): Observable<PaginatedResult<PresentationModel>> {
    return this.http.get<PaginatedResult<PresentationModel>>(
      `${environment.apiUrl}/user/presentations`
    );
  }

  getUsersWithPresentationsCount(): Observable<
    UserWithPresentationsCountModel[]
  > {
    return this.http.get<UserWithPresentationsCountModel[]>(
      `${environment.apiUrl}/user/presentations-count`
    );
  }

  joinPresentationByCode(code: string): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/presentation?verificationCode=${code}`
    );
  }

  getPresentationsWithShows(
    id: string,
    page = 0,
    size = 5
  ): Observable<PresentationWithShows> {
    return this.http.get<PresentationWithShows>(
      `${environment.apiUrl}/presentation/${id}/shows?page=${page}&size=${size}`
    );
  }

  getPresentationWithSlides(id: string): Observable<PresentationWithSlides> {
    return this.http.get<PresentationWithSlides>(
      `${environment.apiUrl}/presentation/${id}/slides`
    );
  }

  deletePresentation(id: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${environment.apiUrl}/presentation/${id}`
    );
  }
}
