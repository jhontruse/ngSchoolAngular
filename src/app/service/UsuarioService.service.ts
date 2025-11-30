import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UsuarioInterface } from '../model/UsuarioInterface';
import { ApiError } from '../model/ApiError';
import { UsuarioRolMenuPersonaDTO } from '../model/dto/UsuarioRolMenuPersonaDTO';
import { UsuarioRolMenuPersonaDTORequest } from '../model/dto/UsuarioRolMenuPersonaDTORequest';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getUsuarioByUsername(username: string): Observable<UsuarioInterface> {
    return this.http
      .get<UsuarioInterface>(`${this.apiUrl}/intranet/api/usuario/find/${username}`)
      .pipe(
        tap((response) => {
          console.log('response', response);

          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let customError: ApiError;
          if (error.error && typeof error.error === 'object') {
            customError = error.error as ApiError;
          } else {
            customError = {
              timestamp: new Date().toISOString(),
              status: error.status,
              code: error.statusText,
              message: error.message || 'Ocurrió un error inesperado',
              detail: 'HttpErrorResponse',
              path: this.apiUrl,
            };
          }
          return throwError(() => customError);
        })
      );
  }

  getUsuarioAll(): Observable<UsuarioInterface[]> {
    return this.http.get<UsuarioInterface[]>(`${this.apiUrl}/intranet/api/usuario/find/all`).pipe(
      tap((response) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        let customError: ApiError;
        if (error.error && typeof error.error === 'object') {
          customError = error.error as ApiError;
        } else {
          customError = {
            timestamp: new Date().toISOString(),
            status: error.status,
            code: error.statusText,
            message: error.message || 'Ocurrió un error inesperado',
            detail: 'HttpErrorResponse',
            path: this.apiUrl,
          };
        }
        return throwError(() => customError);
      })
    );
  }

  getUsuarioRolMenuAll(): Observable<UsuarioRolMenuPersonaDTO[]> {
    return this.http
      .get<UsuarioRolMenuPersonaDTO[]>(`${this.apiUrl}/intranet/api/usuario/find/all/dto`)
      .pipe(
        tap((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let customError: ApiError;
          if (error.error && typeof error.error === 'object') {
            customError = error.error as ApiError;
          } else {
            customError = {
              timestamp: new Date().toISOString(),
              status: error.status,
              code: error.statusText,
              message: error.message || 'Ocurrió un error inesperado',
              detail: 'HttpErrorResponse',
              path: this.apiUrl,
            };
          }
          return throwError(() => customError);
        })
      );
  }

  getUsuarioRolMenuByRolEstado(
    usuarioRolMenuPersonaDTORequest: UsuarioRolMenuPersonaDTORequest
  ): Observable<UsuarioRolMenuPersonaDTO[]> {
    return this.http
      .post<UsuarioRolMenuPersonaDTO[]>(
        `${this.apiUrl}/intranet/api/usuario/find/rol/activo`,
        usuarioRolMenuPersonaDTORequest
      )
      .pipe(
        tap((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let customError: ApiError;
          if (error.error && typeof error.error === 'object') {
            customError = error.error as ApiError;
          } else {
            customError = {
              timestamp: new Date().toISOString(),
              status: error.status,
              code: error.statusText,
              message: error.message || 'Ocurrió un error inesperado',
              detail: 'HttpErrorResponse',
              path: this.apiUrl,
            };
          }
          return throwError(() => customError);
        })
      );
  }

  getUsuarioRolMenuPersonaByDni(dni: string): Observable<UsuarioRolMenuPersonaDTO[]> {
    return this.http
      .get<UsuarioRolMenuPersonaDTO[]>(`${this.apiUrl}/intranet/api/usuario/find/dni/${dni}`)
      .pipe(
        tap((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let customError: ApiError;
          if (error.error && typeof error.error === 'object') {
            customError = error.error as ApiError;
          } else {
            customError = {
              timestamp: new Date().toISOString(),
              status: error.status,
              code: error.statusText,
              message: error.message || 'Ocurrió un error inesperado',
              detail: 'HttpErrorResponse',
              path: this.apiUrl,
            };
          }
          return throwError(() => customError);
        })
      );
  }

  updateUsuarioByDni(usuarioInterface: UsuarioInterface): Observable<UsuarioInterface> {
    return this.http
      .put<UsuarioInterface>(`${this.apiUrl}/intranet/api/usuario/update/activo`, usuarioInterface)
      .pipe(
        tap((response) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) => {
          let customError: ApiError;
          if (error.error && typeof error.error === 'object') {
            customError = error.error as ApiError;
          } else {
            customError = {
              timestamp: new Date().toISOString(),
              status: error.status,
              code: error.statusText,
              message: error.message || 'Ocurrió un error inesperado',
              detail: 'HttpErrorResponse',
              path: this.apiUrl,
            };
          }
          return throwError(() => customError);
        })
      );
  }
}
