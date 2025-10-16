export interface UserSession {
  username: string;
  role: string;
  menu: string[];
  token: string;
  authType: string;
  expiresAt: Date;
}
