import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../service/AuthService.service';
import { LoginRequest } from '../../model/LoginRequest';
import { CommonModule } from '@angular/common';
import { ApiError } from '../../model/ApiError';
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
    RouterLink,
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
      password: ['', [Validators.required]],
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
   * Manejar el envío del formulario
   */
  onSubmit(): void {
    // Preparar credenciales
    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

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
          // Redirigir al dashboard o home
          if (this.loginForm.value.rememberMe) {
            localStorage.setItem('rememberedUser', credentials.username);
          } else {
            localStorage.removeItem('rememberedUser');
          }
          console.log('PRUEBAAAA ', this.loginForm.value.rememberMe);
          this.router.navigate(['/pages/home']);
        },
        error: (err: ApiError) => {
          console.log('Error en login:', err);

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
          } else if (err.status === 0) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'No se pudo conectar con el servidor',
              text: 'Intente nuevamente',
              showConfirmButton: true,
              //timer: 4500,
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error al iniciar sesión. Intente nuevamente.',
              text: 'Intente nuevamente',
              showConfirmButton: true,
              //timer: 4500,
            });
          }
        },
      });
  }

  /**
   * Limpiar mensaje de error cuando el usuario empieza a escribir
   */
  onInputChange(): void {}

  /**
   * Cargar usuario recordado desde localStorage
   */
  private loadRememberedUser(): void {
    const remembered: string | undefined = localStorage.getItem('rememberedUser')?.toString();
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

  get f() {
    return this.loginForm['controls'];
  }

  getValidation(val: string): boolean {
    return this.loginForm['controls'][`${val}`].invalid;
  }
}
