import { inject } from '@angular/core';
import { Router, type ActivatedRouteSnapshot, type CanActivateFn } from '@angular/router';
import { AuthServiceService } from '../service/AuthService.service';

/**
 * Guard para proteger rutas basándose en los permisos de menú del usuario
 * Se usa en conjunto con data: { menu: 'HOME' } en las rutas
 */
export const menuGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  // Primero verificar si está autenticado
  if (!authService.isAuthenticated()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    router.navigate(['/denegado']);
    return false;
  }

  // Obtener el menú requerido desde la configuración de la ruta
  const requiredMenu = route.data['menu'] as string;

  // Si no hay menú especificado, permitir acceso
  if (!requiredMenu) {
    return true;
  }

  // Verificar si el usuario tiene acceso al menú
  if (authService.hasMenuAccess(requiredMenu)) {
    return true;
  }

  // El usuario no tiene acceso al menú
  const currentUser = authService.getCurrentUser();
  console.warn(`Acceso denegado: Se requiere acceso al menú "${requiredMenu}"`);
  console.warn(`Menús disponibles para el usuario: ${currentUser?.menu.join(', ')}`);

  // Redirigir a página de acceso denegado
  router.navigate(['/denegado']);
  return false;
};
