import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/paginated-result.model';
import { ShowModel } from '../models/show.model';

@Injectable({ providedIn: 'root' })
export class ShowService {
  constructor(private http: HttpClient) {}
}
