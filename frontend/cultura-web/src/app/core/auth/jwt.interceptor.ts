import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const requestConToken = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(requestConToken).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('INTERCEPTOR HTTP ERROR:', error.status, req.url);
      const esLogin = req.url.includes('/auth/login');

      if (error.status === 401 && !esLogin) {
        authService.logout();

        void router.navigateByUrl('/login', {
          replaceUrl: true,
        });
      }

      return throwError(() => error);
    }),
  );
};
