import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { PersonaInterface } from '../model/PersonaInterface';
import { ApiError } from '../model/ApiError';

@Injectable({
  providedIn: 'root',
})
export class PersonaServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getPersonaByUsername(username: string): Observable<PersonaInterface> {
    return this.http
      .get<PersonaInterface>(`${this.apiUrl}/intranet/api/persona/find/${username}`)
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
}
