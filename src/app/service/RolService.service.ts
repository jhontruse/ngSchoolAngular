import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RolInterface } from '../model/RolInterface';
import { ApiError } from '../model/ApiError';

@Injectable({
  providedIn: 'root',
})
export class RolServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getRolAll(): Observable<RolInterface[]> {
    return this.http.get<RolInterface[]>(`${this.apiUrl}/intranet/api/rol/find/all`).pipe(
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
