import { Menu } from 'primeng/menu';
import { RolInterface } from '../RolInterface';
import { UsuarioInterface } from '../UsuarioInterface';
import { PersonaInterface } from '../PersonaInterface';
import { MenuInterface } from '../MenuInterface';

export interface UsuarioRolMenuPersonaDTO {
  persona: PersonaInterface;
  usuario: UsuarioInterface;
  rol: RolInterface;
  menu: MenuInterface[];
}
