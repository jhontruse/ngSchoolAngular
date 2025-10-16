import { inject } from '@angular/core';
import { Router, type ActivatedRouteSnapshot, type CanActivateFn } from '@angular/router';
import { AuthServiceService } from '../service/AuthService.service';

/**
 * Guard para proteger rutas basándose en roles específicos
 * Se usa en conjunto con data: { roles: ['ROLE_ADMIN'] } en las rutas
 */
export const roleGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  // Primero verificar si está autenticado
  if (!authService.isAuthenticated()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    router.navigate(['/denegado']);
    return false;
  }

  // Obtener los roles requeridos desde la configuración de la ruta
  const requiredRoles = route.data['roles'] as string[];

  // Si no hay roles especificados, permitir acceso
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Obtener el usuario actual
  const currentUser = authService.getCurrentUser();

  // Verificar si el usuario tiene alguno de los roles requeridos
  if (currentUser && requiredRoles.includes(currentUser.role)) {
    return true;
  }

  // El usuario no tiene el rol necesario
  console.warn(`Acceso denegado: Se requiere uno de estos roles: ${requiredRoles.join(', ')}`);
  console.warn(`Rol actual del usuario: ${currentUser?.role}`);

  // Redirigir a página de acceso denegado o home
  router.navigate(['/denegado']);
  return false;
};
