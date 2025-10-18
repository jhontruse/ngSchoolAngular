import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { UserSession } from '../model/UserSession';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from '../model/LoginRequest';
import { LoginResponse } from '../model/LoginResponse';
import { DecodedToken } from '../model/DecodedToken';
import { ApiError } from '../model/ApiError';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Cargar sesión guardada al inicializar el servicio
    this.loadSavedSession();
  }

  /**
   * Realizar login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.handleLoginSuccess(response, credentials.username);
      }),
      catchError((error: HttpErrorResponse) => {
        let customError: ApiError;

        // ❗ El backend ya envía esta estructura en error.error
        if (error.error && typeof error.error === 'object') {
          customError = error.error as ApiError;
        } else {
          // Fallback si el backend no responde con JSON
          customError = {
            timestamp: new Date().toISOString(),
            status: error.status,
            code: 'UNKNOWN_ERROR',
            message: error.message || 'Ocurrió un error inesperado',
            detail: 'HttpErrorResponse',
            path: this.apiUrl + '/login',
          };
        }

        // Opcional: logging interno
        /* console.error('Login error:', customError); */

        // ❌ Re-lanzamos el error como observable para el componente
        return throwError(() => customError);
      })
    );
  }

  /**
   * Manejar respuesta exitosa de login
   */
  private handleLoginSuccess(response: LoginResponse, username: string): void {
    const decodedToken = this.decodeToken(response.access_token);

    const userSession: UserSession = {
      username: username,
      role: decodedToken.role,
      menu: decodedToken.menu,
      token: response.access_token,
      authType: response.AuthType,
      expiresAt: new Date(decodedToken.exp * 1000),
    };

    // Guardar en localStorage
    this.saveSession(userSession);

    // Actualizar BehaviorSubject
    this.currentUserSubject.next(userSession);
  }

  /**
   * Decodificar JWT Token
   */
  private decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Token inválido');
    }
  }

  /**
   * Guardar sesión en localStorage
   */
  private saveSession(session: UserSession): void {
    localStorage.setItem('token', session.token);
    localStorage.setItem('authType', session.authType);
    localStorage.setItem('username', session.username);
    localStorage.setItem('role', session.role);
    localStorage.setItem('menu', JSON.stringify(session.menu));
    localStorage.setItem('expiresAt', session.expiresAt.toISOString());
  }

  /**
   * Cargar sesión guardada
   */
  private loadSavedSession(): void {
    const token = localStorage.getItem('token');
    const authType = localStorage.getItem('authType');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const menuStr = localStorage.getItem('menu');
    const expiresAtStr = localStorage.getItem('expiresAt');

    if (token && authType && username && role && menuStr && expiresAtStr) {
      const expiresAt = new Date(expiresAtStr);

      // Verificar si el token no ha expirado
      if (expiresAt > new Date()) {
        const userSession: UserSession = {
          token,
          authType,
          username,
          role,
          menu: JSON.parse(menuStr),
          expiresAt,
        };
        this.currentUserSubject.next(userSession);
      } else {
        // Token expirado, limpiar
        this.logout();
      }
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authType');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('menu');
    localStorage.removeItem('expiresAt');

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtener tipo de autenticación
   */
  getAuthType(): string | null {
    return localStorage.getItem('authType');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken(token);
      const expiresAt = new Date(decoded.exp * 1000);
      return expiresAt > new Date();
    } catch {
      return false;
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Verificar si el usuario tiene acceso a un menú específico
   */
  hasMenuAccess(menuItem: string): boolean {
    const user = this.getCurrentUser();
    return user?.menu.includes(menuItem) ?? false;
  }
}
