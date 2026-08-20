import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Parque, ParquesResponse } from './parques.service';

@Injectable({
  providedIn: 'root',
})
export class ParquesPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/public/parques';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<ParquesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ParquesResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Parque> {
    return this.http.get<Parque>(`${this.apiUrl}/${id}`);
  }
}
