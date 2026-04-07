// src/app/core/interceptors/auth.interceptor.ts
// ─────────────────────────────────────────────────────────────
// Interceptor HTTP: agrega el header Authorization: Bearer <token>
// en todas las peticiones al backend automáticamente.
// ─────────────────────────────────────────────────────────────
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Solo agrega el header si hay token y la petición va al backend
  if (token && req.url.includes('localhost:8080')) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  return next(req);
};
