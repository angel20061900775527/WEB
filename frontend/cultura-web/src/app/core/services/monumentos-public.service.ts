import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Monumento, MonumentosResponse } from './monumentos.service';

@Injectable({
  providedIn: 'root',
})
export class MonumentosPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/public/monumentos';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<MonumentosResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<MonumentosResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Monumento> {
    return this.http.get<Monumento>(`${this.apiUrl}/${id}`);
  }
}

