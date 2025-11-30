import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { authGuardGuard } from '../guard/authGuard.guard';
import { Not403Component } from './not403-component/not403-component';
import { roleGuardGuard } from '../guard/roleGuard.guard';
import { menuGuardGuard } from '../guard/menuGuard.guard';
import { NotaComponent } from './nota-component/nota-component';
import { SeguridadComponent } from './seguridad-component/seguridad-component';
import { SeguridadUsuarioComponent } from './seguridad-component/pages/seguridad-usuario-component/seguridad-usuario-component';
import { SeguridadRolComponent } from './seguridad-component/pages/seguridad-rol-component/seguridad-rol-component';
import { SeguridadMenuComponent } from './seguridad-component/pages/seguridad-menu-component/seguridad-menu-component';

export const pagesRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_PROFESOR'],
      //menu: ['NOTA'],
    }, // Roles permitidos
    title: 'Home',
  },
  {
    path: 'nota',
    component: NotaComponent,
    canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_PROFESOR'],
      //menu: 'NOTA',
    }, // Roles permitidos
    title: 'Nota',
  },
  {
    path: 'seguridad',
    component: SeguridadComponent,
    canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación
    data: {
      roles: ['ROLE_ADMIN'],
      //menu: 'NOTA',
    }, // Roles permitidos
    title: 'Seguridad',
    children: [
      {
        path: 'usuario',
        component: SeguridadUsuarioComponent,
        canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación,
      },
      {
        path: 'rol',
        component: SeguridadRolComponent,
        canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación,
      },
      {
        path: 'menu',
        component: SeguridadMenuComponent,
        canActivate: [authGuardGuard, roleGuardGuard, menuGuardGuard], // Requiere autenticación,
      },
      { path: '', redirectTo: 'usuario', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
