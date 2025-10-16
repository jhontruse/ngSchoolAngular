import { inject } from '@angular/core';
import {
  Router,
  type ActivatedRouteSnapshot,
  type CanActivateFn,
  type RouterStateSnapshot,
} from '@angular/router';
import { AuthServiceService } from '../service/AuthService.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Verifica si el usuario tiene un token válido y no ha expirado
 */
export const authGuardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    // Token válido, permitir acceso
    return true;
  }

  // Token inválido o expirado
  console.warn('Acceso denegado: Token inválido o expirado');

  // Limpiar sesión si existe
  if (authService.getToken()) {
    authService.logout();
  }

  // Redirigir al login guardando la URL solicitada
  /*router.navigate(['/denegado'], {
    queryParams: { returnUrl: state.url },
  });*/
  router.navigate(['/denegado']);

  return false;
};
