import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not404-component',
  imports: [],
  templateUrl: './not404-component.html',
  styleUrl: './not404-component.css',
})
export class Not404Component {
  constructor() {}

  router = inject(Router);

  getIrHome() {
    this.router.navigate(['/login']);
  }
}
