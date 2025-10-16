import { Component, inject } from '@angular/core';
import { interval, map, startWith } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not500-component',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './not500-component.html',
  styleUrl: './not500-component.css',
})
export class Not500Component {
  time$ = interval(1000).pipe(
    startWith(0), // emite de inmediato
    map(() => new Date()) // genera la hora actual
  );

  router = inject(Router);

  getIrHome() {
    this.router.navigate(['/pages/home']);
  }
}
