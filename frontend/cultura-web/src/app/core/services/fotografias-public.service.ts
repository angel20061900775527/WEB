import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Fotografia, TipoPatrimonio } from './fotografias.service';

@Injectable({
  providedIn: 'root',
})
export class FotografiasPublicService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/public/fotografias';

  getAll(tipoPatrimonio: TipoPatrimonio, registroId: string | number): Observable<Fotografia[]> {
    return this.http.get<Fotografia[]>(`${this.apiUrl}/${tipoPatrimonio}/${registroId}`);
  }
}
