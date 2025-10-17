import { Component, OnInit } from '@angular/core';
import { LoadingServiceService } from '../../service/LoadingService.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common'; // ✅ Importar esto

@Component({
  selector: 'app-loading-component',
  imports: [ProgressSpinnerModule, CommonModule],
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.css',
})
export class LoadingComponent implements OnInit {
  constructor(public loadingService: LoadingServiceService) {
    console.log('🎨 Loading Component - Initialized');
  }

  ngOnInit() {
    this.loadingService.loading$.subscribe((isLoading) => {
      console.log('🎨 Loading Component - Estado:', isLoading);
    });
  }
}
