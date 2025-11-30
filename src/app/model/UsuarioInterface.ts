export interface UsuarioInterface {
  idUsuario: string;
  usuario: string;
  email: string;
  password: string;
  activo: Boolean;
  createAt: Date;
  updateAt: Date;
  locked: Boolean;
  accountExpiresAt: Date;
  credentialsExpiresAt: Date;
  failedLoginAttempts: Number;
  lockedAt: Date;
}
