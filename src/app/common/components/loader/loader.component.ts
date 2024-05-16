import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoaderService } from '@common/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-bar" *ngIf="waiting"></div>
  `,
  styles: [`
    .loader-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background-color: #3498db;
      z-index: 9999;
      animation: loading 2s linear infinite;
    }

    @keyframes loading {
      0% { left: -100%; width: 100%; }
      50% { left: 25%; width: 50%; }
      100% { left: 100%; width: 100%; }
    }
  `]
})
export class LoaderComponent implements OnInit {
  loaderService = inject(LoaderService);

  constructor() {}

  ngOnInit() {
  }


  get waiting(): boolean {
    return this.loaderService.waiting();
  }
}

