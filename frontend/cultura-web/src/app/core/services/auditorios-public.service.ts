import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Auditorio, AuditoriosResponse } from './auditorios.service';

@Injectable({
  providedIn: 'root',
})
export class AuditoriosPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/public/auditorios';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<AuditoriosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<AuditoriosResponse>(this.apiUrl, { params });
  }

  getById(id: number | string): Observable<Auditorio> {
    return this.http.get<Auditorio>(`${this.apiUrl}/${id}`);
  }
}

