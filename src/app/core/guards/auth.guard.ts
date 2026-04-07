// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    // JWT usa base64url (con - y _), hay que convertir antes de atob
    const base64url = token.split('.')[1];
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (payload.exp * 1000 > Date.now()) {
      return true;
    }
  } catch {
    // Si falla la decodificación, igual dejar pasar si hay token
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};