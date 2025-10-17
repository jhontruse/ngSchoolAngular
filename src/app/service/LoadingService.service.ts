import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingServiceService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;

  /**
   * Mostrar loading
   */
  show(): void {
    this.requestCount++;
    console.log('📊 Loading Service - Show called. Request count:', this.requestCount);
    this.loadingSubject.next(true);
  }

  /**
   * Ocultar loading
   * Solo oculta cuando todas las peticiones han terminado
   */
  hide(): void {
    this.requestCount--;
    console.log('📊 Loading Service - Hide called. Request count:', this.requestCount);

    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
      console.log('✅ Loading Service - Loading hidden');
    }
  }

  /**
   * Forzar ocultar loading
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
    console.log('🔴 Loading Service - Force hidden');
  }

  /**
   * Obtener estado actual
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
