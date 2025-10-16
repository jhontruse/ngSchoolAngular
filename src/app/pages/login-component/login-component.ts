import { booleanAttribute, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../service/AuthService.service';
import { LoginRequest } from '../../model/LoginRequest';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../model/LoginResponse';
import { ApiError } from '../../model/ApiError';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/pages/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Obtener la URL de retorno de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pages/home';
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle visibilidad de password
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Manejar el envío del formulario
   */
  onSubmit(): void {
    // Limpiar mensaje de error previo
    this.errorMessage = '';

    // Validar formulario
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    // Preparar credenciales
    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    // Iniciar loading
    this.isLoading = true;
    // Realizar login
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirigir al dashboard o home
        this.router.navigate(['/pages/home']);
      },
      error: (err: ApiError) => {
        console.error('Error en login:', err);
        this.isLoading = false;

        // Manejar diferentes tipos de errores
        if (err.status === 401) {
          this.errorMessage = err.message;
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = err.message || 'Error al iniciar sesión. Intente nuevamente.';
        }
      },
    });
  }

  /**
   * Marcar todos los campos como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Limpiar mensaje de error cuando el usuario empieza a escribir
   */
  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}
