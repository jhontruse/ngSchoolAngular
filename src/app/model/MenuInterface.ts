export interface MenuInterface {
  idMenu: string;
  nombre: string;
  path: string;
  icono: string;
  orden: number;
  idPadre: string;
  activo: Boolean;
  createAt: Date;
  updateAt: Date;
}
