// src/app/core/services/auth.service.ts
// ─────────────────────────────────────────────────────────────
// Servicio de autenticación - conecta Angular con el backend
// Spring Boot mediante JWT.
// ─────────────────────────────────────────────────────────────
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  codigo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;      // "Bearer"
  id: number;
  codigo: string;
  nombre: string;
  rol: string;       // "ADMIN" | "SUPERVISOR" | "AGENTE"
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // URL base del backend Spring Boot
private readonly API_URL = 'https://prolific-happiness-production-e093.up.railway.app/api';
  constructor(private http: HttpClient, private router: Router) {}

  // ── LOGIN ────────────────────────────────────────────────────
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, request)
      .pipe(
        tap(response => {
          // Guardar token y datos del usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify({
            id:     response.id,
            codigo: response.codigo,
            nombre: response.nombre,
            rol:    response.rol
          }));
        })
      );
  }

  // ── LOGOUT ───────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/auth/login']);
  }

  // ── HELPERS ──────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      // Verificar que el token no haya expirado (decodifica payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUsuario(): { id: number; codigo: string; nombre: string; rol: string } | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  getRol(): string | null {
    return this.getUsuario()?.rol ?? null;
  }
}
