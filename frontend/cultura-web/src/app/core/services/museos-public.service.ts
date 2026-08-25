import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Museo, MuseosResponse } from './museos.service';

@Injectable({
  providedIn: 'root',
})
export class MuseosPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/public/museos';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<MuseosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<MuseosResponse>(this.apiUrl, { params });
  }

  getById(id: number | string): Observable<Museo> {
    return this.http.get<Museo>(`${this.apiUrl}/${id}`);
  }
}
