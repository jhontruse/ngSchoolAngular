import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptorInterceptor } from './interceptor/httpInterceptor.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { loadingInterceptorInterceptor } from './interceptor/loadingInterceptor.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

const BrownTheme = {
  ...Aura,
  semantic: {
    ...Aura.semantic,
    primary: {
      50: '#f3e5dc',
      100: '#e0bfa0',
      200: '#cd9766',
      300: '#b76c2f',
      400: '#a0522d', // principal
      500: '#8b4513', // oscuro
      600: '#70340f',
      700: '#55280c',
      800: '#3b1b08',
      900: '#251006',
    },
  },
};

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
    provideAnimations(), // En lugar de provideAnimations()
    // Configuración de PrimeNG v20
    providePrimeNG({
      theme: {
        preset: BrownTheme,
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
