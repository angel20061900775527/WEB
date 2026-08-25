import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Plaza, PlazasResponse } from './plazas.service';

@Injectable({
  providedIn: 'root',
})
export class PlazasPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/public/plazas';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<PlazasResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PlazasResponse>(this.apiUrl, { params });
  }

  getById(id: number | string): Observable<Plaza> {
    return this.http.get<Plaza>(`${this.apiUrl}/${id}`);
  }
}
