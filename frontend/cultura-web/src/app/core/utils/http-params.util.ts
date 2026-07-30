import { HttpParams } from '@angular/common/http';

import { QueryParams } from '../models/query-params.model';

export function buildHttpParams(query: QueryParams): HttpParams {
  let params = new HttpParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  });

  return params;
}
