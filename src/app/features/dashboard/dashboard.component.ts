// src/app/features/dashboard/dashboard.component.ts
// ─────────────────────────────────────────────────────────────
// Dashboard placeholder — reemplaza con tu módulo real.
// Muestra los datos del usuario logueado y un botón de logout.
// ─────────────────────────────────────────────────────────────
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:2rem; font-family:sans-serif;">
      <h1>Dashboard Impulsa A365</h1>
      <p *ngIf="usuario">
        Bienvenido, <strong>{{ usuario.nombre }}</strong> —
        Rol: <strong>{{ usuario.rol }}</strong> ({{ usuario.codigo }})
      </p>
      <button (click)="logout()"
              style="padding:0.5rem 1rem; background:#e53935; color:white;
                     border:none; border-radius:4px; cursor:pointer;">
        Cerrar Sesión
      </button>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  usuario: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
  }

  logout() {
    this.authService.logout();
  }
}
