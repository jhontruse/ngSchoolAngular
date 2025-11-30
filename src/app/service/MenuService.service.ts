import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { MenuInterface } from '../model/MenuInterface';
import { ApiError } from '../model/ApiError';

@Injectable({
  providedIn: 'root',
})
export class MenuServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getMenuByUsername(username: string): Observable<MenuInterface[]> {
    return this.http.get<MenuInterface[]>(`${this.apiUrl}/intranet/api/menu/find/${username}`).pipe(
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
