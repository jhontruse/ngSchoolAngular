import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from './interceptor/httpInterceptor.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { loadingInterceptorInterceptor } from './interceptor/loadingInterceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    //provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        loadingInterceptorInterceptor, // Ejecutar primero para mostrar loading
        httpInterceptorInterceptor, // Luego agregar token y manejar errores
      ])
    ),
    // Configuración de PrimeNG v20
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: false || 'none', // Para modo oscuro
          cssLayer: false,
        },
      },
      ripple: true, // Efecto ripple en botones
      inputStyle: 'outlined', // 'outlined' o 'filled'
      inputVariant: 'filled',
      zIndex: {
        modal: 1100, // dialog, sidebar
        overlay: 1000, // dropdown, overlaypanel
        menu: 1000, // overlay menus
        tooltip: 1100, // tooltip
      },
      translation: {
        accept: 'Aceptar',
        reject: 'Rechazar',
        //translations
      },
    }),
  ],
};
