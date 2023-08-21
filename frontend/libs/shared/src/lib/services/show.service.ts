import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'apps/mindsync/src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ShowService {
  constructor(private http: HttpClient) {}

  public deleteShow(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.apiUrl}/show/${id}`);
  }

  public getExcelFile(id: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/show/${id}/excel`, {
      responseType: 'blob',
    });
  }
}
