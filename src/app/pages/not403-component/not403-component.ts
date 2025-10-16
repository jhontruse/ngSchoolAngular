import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not403-component',
  imports: [],
  templateUrl: './not403-component.html',
  styleUrl: './not403-component.css',
})
export class Not403Component {
  router = inject(Router);

  getIrHome() {
    this.router.navigate(['/login']);
  }
}
