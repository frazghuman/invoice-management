import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '@common/components/side-nav/side-nav.component';
import { StopScrollDirective } from '@common/directives/stop-scroll.directive';
import { BackdropService } from '@common/services/signals/backdrop.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideNavComponent, StopScrollDirective],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  backDropService = inject(BackdropService);
  backdropVisible = this.backDropService.select('visible');
  constructor() {
    effect(() => {
      console.log(`Show Back drop: ${this.backdropVisible()}`);
    });
  }
  ngOnInit(): void {
    
  }
}
