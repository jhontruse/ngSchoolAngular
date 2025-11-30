import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ResetMailServiceService } from '../../../../service/ResetMailService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-random-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    PasswordModule,
    InputIcon,
    IconField,
    RouterLink,
  ],
  templateUrl: './random-component.html',
  styleUrl: './random-component.css',
})
export class RandomComponent implements OnInit {
  loginForm: FormGroup;
  showNewPassword = false;
  showConfirmPassword = false;
  token: string | undefined;
  serviceResetMail = inject(ResetMailServiceService);
  validRandom: boolean | undefined;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group(
      {
        newPassword: ['', [this.strongPasswordValidator]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator(),
      }
    );
  }

  passwordMatchValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');

      if (!newPassword || !confirmPassword) {
        return null;
      }
      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }
      return null;
    };
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.token = params['random'];
      console.log('this.token', this.token);
      this.serviceResetMail.getCheckMail(this.token!).subscribe((response) => {
        console.log('Check mail response:', response);
        if (response === 2) {
          this.validRandom = true;
        } else if (response === 1) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ocurrio un problema',
            text: 'El token ha expirado. Solicite uno nuevo.',
            showConfirmButton: true,
          });
          this.router.navigate(['login']);
        } else if (response === 3) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ocurrio un problema',
            text: 'El token no existe. Solicite uno nuevo.',
            showConfirmButton: true,
          });
          this.router.navigate(['login']);
        }
      });
    });
    // response values:
    // 2 - Vigente
    // 1 - Expirado -> Login
    // 3 - No existe -> Login
  }

  /**
   * Manejar el envío del formulario
   */
  onSubmit(): void {
    const newPassword = this.loginForm.value.newPassword;
    this.serviceResetMail.resetMail(this.token!, newPassword).subscribe((response) => {
      if (response === 1) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Contraseña restablecida exitosamente',
          showConfirmButton: true,
        });
        this.router.navigate(['login']);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Ocurrio un problema',
          text: 'Intente nuevamente',
          showConfirmButton: true,
        });
      }
    });
  }

  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control['value'] || '';
    const errors: ValidationErrors = {};

    if (value === null) {
      errors['required'] = 'La contraseña es requerida';
    } else if (value.length < 8) {
      errors['minLength'] = 'Debe tener al menos 8 caracteres';
    } else if (!/[a-z]/.test(value)) {
      errors['lowercase'] = 'Debe contener al menos una letra minúscula';
    } else if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = 'Debe contener al menos una letra mayúscula';
    } else if (!/\d/.test(value)) {
      errors['digit'] = 'Debe contener al menos un número';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(value)) {
      errors['special'] = 'Debe contener al menos un carácter especial';
    } else if (/\s/.test(value)) {
      errors['whitespace'] = 'No debe contener espacios';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  get f() {
    return this.loginForm['controls'];
  }
}
