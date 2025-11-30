import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthServiceService } from '../../../service/AuthService.service';
import { ResetMailServiceService } from '../../../service/ResetMailService.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-component',
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    PasswordModule,
  ],
  templateUrl: './forgot-component.html',
  styleUrl: './forgot-component.css',
})
export class ForgotComponent {
  loginForm: FormGroup;
  serviceResetMail = inject(ResetMailServiceService);
  private router = inject(Router);

  constructor(public route: ActivatedRoute, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.serviceResetMail.getSendMail(this.loginForm.value.usuario).subscribe((response) => {
      console.log('Mail sent response:', response);
      if (response === 1) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se envió el correo de restablecimiento de contraseña',
          showConfirmButton: true,
          //timer: 4500,
        });
        this.router.navigate(['login']);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Ocurrio un problema',
          text: 'Intente nuevamente',
          showConfirmButton: true,
          //timer: 4500,
        });
      }
    });
  }
}
