import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login-component/login-component';
import { LayoutComponent } from './pages/layout-component/layout-component';
import { Not404Component } from './pages/not404-component/not404-component';
import { Not403Component } from './pages/not403-component/not403-component';
import { loginGuardGuard } from './guard/loginGuard.guard';
import { Not500Component } from './pages/not500-component/not500-component';
import { LoadingComponent } from './pages/loading-component/loading-component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuardGuard], // Evitar acceso si ya está autenticado
  },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.routes').then((x) => x.pagesRoutes),
  },
  {
    path: 'denegado',
    component: Not403Component,
  },
  {
    path: 'error-server',
    component: Not500Component,
  },
  {
    path: 'loading',
    component: LoadingComponent,
  },
  { path: '**', component: Not404Component },
];
