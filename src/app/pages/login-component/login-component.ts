import { booleanAttribute, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../service/AuthService.service';
import { LoginRequest } from '../../model/LoginRequest';
import { CommonModule } from '@angular/common';
import { ApiError } from '../../model/ApiError';
import { ButtonModule, Button } from 'primeng/button';
import { catchError, throwError, timeout } from 'rxjs';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { Checkbox } from 'primeng/checkbox';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    PasswordModule,
    Checkbox,
    Button,
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/pages/home';
  rememberMe: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [],
    });
  }

  ngOnInit(): void {
    // Obtener la URL de retorno de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pages/home';
    // Cargar usuario recordado si existe
    this.loadRememberedUser();
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
    this.authService
      .login(credentials)
      .pipe(
        timeout(15000), // ⏱ 5 segundos de espera
        catchError((error) => {
          // Si el timeout se dispara o cualquier otro error ocurre
          if (error.name === 'TimeoutError') {
            return throwError(() => ({
              status: 408,
              message: 'El servidor está tardando demasiado en responder',
            }));
          }
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirigir al dashboard o home
          if (this.loginForm.value.rememberMe) {
            sessionStorage.setItem('rememberedUser', credentials.username);
          } else {
            sessionStorage.removeItem('rememberedUser');
          }
          console.log('PRUEBAAAA ', this.loginForm.value.rememberMe);
          this.router.navigate(['/pages/home']);
        },
        error: (err: ApiError) => {
          console.log('Error en login:', err);
          this.isLoading = false;

          // Manejar diferentes tipos de errores
          if (err.status === 401) {
            console.log('Prueba 1');
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: err.message,
              text: 'Intente nuevamente',
              showConfirmButton: true,
              //timer: 4500,
            });
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

  /**
   * Cargar usuario recordado desde sessionStorage
   */
  private loadRememberedUser(): void {
    const remembered: String | undefined = sessionStorage.getItem('rememberedUser')?.toString();
    console.log('remembered ', remembered);

    if (remembered) {
      this.loginForm.patchValue({
        username: remembered,
      });
      this.loginForm.get('rememberMe')?.setValue(true);
    } else {
      this.loginForm.get('rememberMe')?.setValue(false);
    }
  }
}
