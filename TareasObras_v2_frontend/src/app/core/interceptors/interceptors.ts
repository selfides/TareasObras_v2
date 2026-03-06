import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Solo hacer logout en 401 si NO es el endpoint de login
      // y si hay un token guardado (sesión expirada, no primer login)
      if (err.status === 401 && !req.url.includes('/auth/') && localStorage.getItem('token')) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
};
