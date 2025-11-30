import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { AuthServiceService } from '../../service/AuthService.service';
import { MenuServiceService } from '../../service/MenuService.service';
import { MenuInterface } from '../../model/MenuInterface';
import { CommonModule } from '@angular/common';
import { PersonaServiceService } from '../../service/PersonaService.service';
import { PersonaInterface } from '../../model/PersonaInterface';
import { UsuarioServiceService } from '../../service/UsuarioService.service';
import { UsuarioInterface } from '../../model/UsuarioInterface';
import { Tooltip } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-layout-component',
  imports: [
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    DividerModule,
    OverlayBadgeModule,
    TagModule,
    AvatarModule,
    ToastModule,
    BadgeModule,
    RouterLinkWithHref,
    RouterLinkActive,
    CommonModule,
    Tooltip,
    InputTextModule,
  ],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.css',
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthServiceService);
  serviceMenu = inject(MenuServiceService);
  servicePersona = inject(PersonaServiceService);
  serviceUsuario = inject(UsuarioServiceService);

  p_val_rol: string = '';
  listaMenu: MenuInterface[] = [];
  persona: PersonaInterface | undefined;
  usuario: UsuarioInterface | undefined;

  constructor() {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.p_val_rol = currentUser?.role || '';
    this.p_val_rol = this.p_val_rol.replace('ROLE_', '');

    this.serviceMenu.getMenuByUsername(currentUser?.username || '').subscribe({
      next: (menus) => {
        this.listaMenu = menus || [];
        this.listaMenu.forEach((menuItem) => {
          console.log('Menu Item:', menuItem.nombre);
        });
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });

    this.servicePersona.getPersonaByUsername(currentUser?.username || '').subscribe({
      next: (personas) => {
        this.persona = personas || '';
        console.log('Persona:', this.persona);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });

    this.serviceUsuario.getUsuarioByUsername(currentUser?.username || '').subscribe({
      next: (usuarios) => {
        this.usuario = usuarios || '';
        console.log('Usuario:', this.usuario);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });
  }

  getMenuIconPath(iconName: string): string {
    return `/assets/img/image/home/${iconName.toLowerCase()}.png`;
  }

  getMenuPath(path: string): string {
    return path.toLowerCase();
  }

  logout(): void {
    this.authService.logout();
  }
}
