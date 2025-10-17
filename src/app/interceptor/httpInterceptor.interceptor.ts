import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../service/AuthService.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP para agregar el token JWT a todas las peticiones
 * Maneja errores 401 (No autorizado) y 403 (Prohibido)
 * No implementa refresh token
 */
export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  // URLs que no requieren token (whitelist)
  const publicUrls = ['/login', '/register', '/forgot-password', '/public', '/loading'];

  // Verificar si la URL es pública
  const isPublicUrl = publicUrls.some((url) => req.url.includes(url));

  // Si es una URL pública, no agregar token
  if (isPublicUrl) {
    console.log('🌐 Petición pública:', req.url);
    return next(req);
  }

  // Obtener token y tipo de autenticación
  const token = authService.getToken();
  const authType = authService.getAuthType() || 'Bearer';

  // Si hay token, clonar la petición y agregar headers
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `${authType} ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('🔐 Petición autenticada:', req.url);
  } else {
    console.warn('⚠️ Petición sin token:', req.url);
  }

  // Continuar con la petición y manejar errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejar error 401 - No autorizado (Token inválido o expirado)
      if (error.status === 401) {
        console.error('❌ Error 401: Token inválido o expirado');

        // Limpiar sesión
        authService.logout();

        // Redirigir al login con mensaje
        router.navigate(['/login'], {
          queryParams: {
            returnUrl: router.url,
            message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
          },
        });
      }
      // Manejar error 403 - Prohibido (Sin permisos)
      if (error.status === 403) {
        console.error('❌ Error 403: Sin permisos suficientes');
        router.navigate(['/denegado']);
      }

      // Manejar error 404 - No encontrado
      if (error.status === 404) {
        console.error('❌ Error 404: Recurso no encontrado');
        router.navigate(['/notfound']);
      }

      // Manejar error 500 - Error del servidor
      if (error.status === 500) {
        console.error('❌ Error 500: Error interno del servidor');
        router.navigate(['/error-server']);
      }

      // Manejar error 0 - Sin conexión
      if (error.status === 0) {
        console.error('❌ Error de conexión: No se pudo conectar con el servidor');
        router.navigate(['/error-server']);
      }

      // Propagar el error
      return throwError(() => error);
    })
  );
};
