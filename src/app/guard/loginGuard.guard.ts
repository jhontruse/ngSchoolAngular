import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthServiceService } from '../service/AuthService.service';

export const loginGuardGuard: CanActivateFn = () => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (authService.isAuthenticated()) {
    router.navigate(['/pages/home']);
    return false;
  }

  // Usuario no autenticado, permitir acceso al login
  return true;
};
