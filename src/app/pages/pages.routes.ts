import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { authGuardGuard } from '../guard/authGuard.guard';
import { Not403Component } from './not403-component/not403-component';
import { roleGuardGuard } from '../guard/roleGuard.guard';
import { menuGuardGuard } from '../guard/menuGuard.guard';

export const pagesRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación
    data: { roles: ['ROLE_ADMIN', 'ROLE_ALUMNO'], menu: 'HOME' }, // Roles permitidos
    title: 'Home',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
