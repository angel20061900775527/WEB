import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Rio, RiosResponse } from './rios.service';

@Injectable({
  providedIn: 'root',
})
export class RiosPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/public/rios';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<RiosResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<RiosResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Rio> {
    return this.http.get<Rio>(`${this.apiUrl}/${id}`);
  }
}
