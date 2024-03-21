import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from '@common/components/side-nav/side-nav.component';
import { StopScrollDirective } from '@common/directives/stop-scroll.directive';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideNavComponent, StopScrollDirective],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  backdropVisible: boolean = false;
  ngOnInit(): void {
    
  }
  
  onSideBarStateChange(state: boolean) {
    this.backdropVisible = state;
  }
}
