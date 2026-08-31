import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Calle, CallesResponse } from './calles.service';

@Injectable({
  providedIn: 'root',
})
export class CallesPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/public/calles';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<CallesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<CallesResponse>(this.apiUrl, {
      params,
    });
  }

  getById(id: string): Observable<Calle> {
    return this.http.get<Calle>(`${this.apiUrl}/${id}`);
  }
}

