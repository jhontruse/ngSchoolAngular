import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ApiError } from '../model/ApiError';

@Injectable({
  providedIn: 'root',
})
export class ResetMailServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getSendMail(usuario: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/mail/sendMail/${usuario}`).pipe(
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

  getCheckMail(random: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/mail/reset/check/${random}`).pipe(
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

  resetMail(random: string, newPassword: string): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/mail/reset/${random}`, newPassword).pipe(
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
