// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading    = false;
  errorMessage = '';

  constructor(
    private fb:          FormBuilder,
    private router:      Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      codigo:      ['', Validators.required],
      password:    ['', [Validators.required, Validators.minLength(6)]],
      recuerdame:  [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading    = true;
    this.errorMessage = '';

    const { codigo, password } = this.loginForm.value;

    this.authService.login({ codigo, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        const segmentos = this.getRutaPorRol(response.rol);
        this.router.navigate(segmentos);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Código o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor.';
        } else {
          this.errorMessage = 'Error inesperado. Intenta de nuevo.';
        }
      }
    });
  }

  private getRutaPorRol(rol: string): string[] {
    switch (rol) {
      case 'ADMIN':      return ['dashboard', 'admin'];
      case 'SUPERVISOR': return ['dashboard', 'supervisor'];
      case 'AGENTE':     return ['dashboard', 'agente'];
      default:           return ['dashboard'];
    }
  }

  get codigo()   { return this.loginForm.get('codigo'); }
  get password() { return this.loginForm.get('password'); }
}