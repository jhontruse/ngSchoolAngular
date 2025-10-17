import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingServiceService } from '../service/LoadingService.service';
import { finalize, timeout } from 'rxjs';

/**
 * Interceptor para mostrar/ocultar loading spinner
 * durante las peticiones HTTP
 */
export const loadingInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingServiceService);

  // URLs que no deben mostrar loading
  const skipLoadingUrls = ['/auth/validate-token', '/notifications/count', '/loading'];

  const shouldSkipLoading = skipLoadingUrls.some((url) => req.url.includes(url));

  console.log('🔄 Loading Interceptor - URL:', req.url, 'Skip:', shouldSkipLoading);

  if (!shouldSkipLoading) {
    console.log('⏳ Mostrando loading...');
    loadingService.show();

    // Guardar el timestamp de inicio
    const startTime = Date.now();
    const MINIMUM_LOADING_TIME = 1000; // 500ms mínimo

    return next(req).pipe(
      finalize(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

        console.log(
          `⏱️ Tiempo transcurrido: ${elapsedTime}ms, Delay adicional: ${remainingTime}ms`
        );

        // Esperar el tiempo restante antes de ocultar
        setTimeout(() => {
          console.log('✅ Ocultando loading...');
          loadingService.hide();
        }, remainingTime);
      })
    );
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkipLoading) {
        console.log('✅ Ocultando loading...');
        loadingService.hide();
      }
    })
  );
};
