export interface DecodedToken {
  iss: string;
  role: string;
  menu: string[];
  sub: string;
  iat: number;
  exp: number;
}
