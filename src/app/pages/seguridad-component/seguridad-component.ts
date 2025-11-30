import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-seguridad-component',
  imports: [
    CardModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './seguridad-component.html',
  styleUrl: './seguridad-component.css',
})
export class SeguridadComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'usuarios',
        icon: '/assets/img/image/seguridad/usuarios.png',
        routerLink: 'usuario',
      },
      {
        label: 'Roles',
        icon: '/assets/img/image/seguridad/roles.png',
        routerLink: 'rol',
      },
      {
        label: 'Menus',
        icon: '/assets/img/image/seguridad/menus.png',
        routerLink: 'menu',
      },
    ];
  }
}
