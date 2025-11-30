import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { UsuarioServiceService } from '../../../../service/UsuarioService.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, NgModel } from '@angular/forms';
import { UsuarioRolMenuPersonaDTO } from '../../../../model/dto/UsuarioRolMenuPersonaDTO';
import { BadgeModule } from 'primeng/badge';
import { Message } from 'primeng/message';
import { RolServiceService } from '../../../../service/RolService.service';
import { RolInterface } from '../../../../model/RolInterface';
import { UsuarioRolMenuPersonaDTORequest } from '../../../../model/dto/UsuarioRolMenuPersonaDTORequest';
import { Avatar } from 'primeng/avatar';
import { Tooltip } from 'primeng/tooltip';
import { UsuarioInterface } from '../../../../model/UsuarioInterface';

interface Estado {
  name: string;
  code: string;
}

interface Column {
  field: string;
  header: string;
  type: string;
  entity: string;
}

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-seguridad-usuario-component',
  imports: [
    Select,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    MultiSelectModule,
    FormsModule,
    BadgeModule,
    Message,
    TitleCasePipe,
    LowerCasePipe,
    AutoComplete,
    Avatar,
    Tooltip,
  ],
  templateUrl: './seguridad-usuario-component.html',
  styleUrl: './seguridad-usuario-component.css',
})
export class SeguridadUsuarioComponent implements OnInit {
  //Service
  serviceUsuario = inject(UsuarioServiceService);
  serviceRol = inject(RolServiceService);
  cd = inject(ChangeDetectorRef);

  //Entity
  usuarioRolMenuDTO: UsuarioRolMenuPersonaDTO[] = [];
  usuarioRolMenuPersonaDTORequest: UsuarioRolMenuPersonaDTORequest | undefined;
  usuarioInterface: UsuarioInterface | undefined | null;

  //Otros
  estados: Estado[] | undefined;
  selectedEstado: Estado | undefined;

  cols!: Column[];
  selectedColumns!: Column[];
  loading: boolean = false;
  loadingLimpiar: boolean = false;

  filteredUsuarios: any[] = [];
  value: any;
  validarAutoComplete: any[] = [];

  roles: RolInterface[] | undefined;
  selectedRol: RolInterface | undefined;

  ngOnInit(): void {
    this.estados = [
      { name: 'Activo', code: 'true' },
      { name: 'Inactivo', code: 'false' },
    ];

    this.cols = [
      { field: 'nombres', header: 'Persona', type: 'text', entity: 'persona' },
      { field: 'dni', header: 'DNI', type: 'text', entity: 'persona' },
      { field: 'email', header: 'Email', type: 'text', entity: 'usuario' },
      { field: 'activo', header: 'Estado', type: 'boolean', entity: 'usuario' },
      { field: 'descripcion', header: 'Rol', type: 'text', entity: 'rol' },
      { field: 'nombre', header: 'Menu', type: 'text', entity: 'menu' },
      { field: 'acciones', header: 'Acciones', type: 'text', entity: 'otro' },
    ];
    this.selectedColumns = this.cols;

    this.serviceUsuario.getUsuarioRolMenuAll().subscribe({
      next: (data) => {
        this.usuarioRolMenuDTO = data ?? [];
        this.cd.markForCheck();
        console.log('usuarioRolMenuDTO ', this.usuarioRolMenuDTO);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });

    this.serviceRol.getRolAll().subscribe({
      next: (data) => {
        this.roles = data ?? [];
        console.log('Roles:', this.roles);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  buscar() {
    this.loading = true;

    console.log('selectedEstado ', this.selectedEstado?.code);
    console.log('selectedRol ', this.selectedRol?.nombre);

    this.usuarioRolMenuPersonaDTORequest = {
      rol: this.selectedRol?.nombre ?? null,
      activo: this.selectedEstado?.code ?? null,
    };

    this.serviceUsuario
      .getUsuarioRolMenuByRolEstado(this.usuarioRolMenuPersonaDTORequest)
      .subscribe({
        next: (data) => {
          this.usuarioRolMenuDTO = data ?? [];
          this.cd.markForCheck();
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          console.log('usuarioRolMenuDTO ', this.usuarioRolMenuDTO);
        },
        error: (error) => {
          console.error('Error fetching menu:', error);
        },
      });
  }

  limpiar() {
    this.selectedEstado = undefined;
    this.selectedRol = undefined;
    this.serviceUsuario.getUsuarioRolMenuAll().subscribe({
      next: (data) => {
        this.usuarioRolMenuDTO = data ?? [];
        this.cd.markForCheck();
        this.value = null;
        this.filteredUsuarios = [];
        console.log('usuarioRolMenuDTO ', this.usuarioRolMenuDTO);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });
  }

  cambiarEstado(usuarioRolMenuDTO: UsuarioRolMenuPersonaDTO) {
    console.log('CLIC IMG 1');
    console.log(usuarioRolMenuDTO.usuario);

    if (usuarioRolMenuDTO.usuario.activo) {
      usuarioRolMenuDTO.usuario.activo = false;
    } else {
      usuarioRolMenuDTO.usuario.activo = true;
    }

    this.serviceUsuario.updateUsuarioByDni(usuarioRolMenuDTO.usuario).subscribe({
      next: (data) => {
        this.usuarioInterface = data;
        console.log(data);
        this.serviceUsuario.getUsuarioRolMenuAll().subscribe({
          next: (data) => {
            this.usuarioRolMenuDTO = data ?? [];
            this.cd.markForCheck();
            console.log('usuarioRolMenuDTO ', this.usuarioRolMenuDTO);
          },
          error: (error) => {
            console.error('Error fetching menu:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });
  }

  search(event: any) {
    const query = event.query.toLowerCase().trim();

    // Si no hay query, no filtrar
    if (!query) {
      this.filteredUsuarios = this.usuarioRolMenuDTO.map((item) => this.mapToFilteredItem(item));
      return;
    }

    this.filteredUsuarios = this.usuarioRolMenuDTO
      .filter((item) => this.matchesSearchQuery(item, query))
      .map((item) => this.mapToFilteredItem(item));
  }

  private matchesSearchQuery(item: UsuarioRolMenuPersonaDTO, query: string): boolean {
    const searchFields = [
      item.persona.nombres,
      item.persona.apePaterno,
      item.persona.apeMaterno,
      item.persona.dni,
      item.usuario.usuario,
      item.usuario.email,
      item.rol.nombre,
      // Nombre completo concatenado
      `${item.persona.nombres} ${item.persona.apePaterno} ${item.persona.apeMaterno}`,
      // Solo apellidos
      `${item.persona.apePaterno} ${item.persona.apeMaterno}`,
    ];

    return searchFields.some((field) => field?.toLowerCase().includes(query));
  }

  /**
   * Mapea el item a un formato simplificado para el autocomplete
   */
  private mapToFilteredItem(item: UsuarioRolMenuPersonaDTO) {
    const nombres = this.toTitleCase(item.persona.nombres);
    const apePaterno = this.toTitleCase(item.persona.apePaterno);
    const apeMaterno = this.toTitleCase(item.persona.apeMaterno);
    const nombreCompleto = `${nombres} ${apePaterno} ${apeMaterno}`.trim();

    return {
      label: nombreCompleto, // Lo que se muestra en el input
      value: item, // El objeto completo
      nombres: nombres,
      apePaterno: apePaterno,
      apeMaterno: apeMaterno,
      nombreCompleto: nombreCompleto,
      dni: item.persona.dni,
      usuario: this.toTitleCase(item.usuario.usuario),
      email: item.usuario.email?.toLowerCase(),
      rol: this.toTitleCase(item.rol.nombre),
      activo: item.usuario.activo,
    };
  }

  onClear() {
    console.log('🗑️ AutoComplete limpiado');
    this.value = null;
    this.filteredUsuarios = [];
    this.serviceUsuario.getUsuarioRolMenuAll().subscribe({
      next: (data) => {
        this.usuarioRolMenuDTO = data ?? [];
        this.cd.markForCheck();
        console.log('usuarioRolMenuDTO ', this.usuarioRolMenuDTO);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });
  }

  onUsuarioSelect(event: any) {
    console.log('Usuario seleccionado:', event.value.dni);
    this.serviceUsuario.getUsuarioRolMenuPersonaByDni(event.value.dni).subscribe({
      next: (data) => {
        this.usuarioRolMenuDTO = data ?? [];
        this.validarAutoComplete = event;
        this.cd.markForCheck();
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        console.log('usuarioRolMenuDTO ', this.usuarioRolMenuDTO);
      },
      error: (error) => {
        console.error('Error fetching menu:', error);
      },
    });
  }

  getInitials(nombre: string): string {
    if (!nombre) return 'U';
    return nombre

      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  private toTitleCase(text: string | null | undefined): string {
    if (!text) return '';

    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
