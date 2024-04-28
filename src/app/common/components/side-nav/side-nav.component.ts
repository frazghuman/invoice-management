import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { Router, RouterModule } from '@angular/router';
import { BackdropService } from '@common/services/signals/backdrop.service';
import { AuthService } from '@common/services/auth/auth.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
  backDropService = inject(BackdropService);
  showSideBar: boolean = false;
  toggleSidebar() {
    this.showSideBar = !this.showSideBar;
    this.backDropService.set('visible', this.showSideBar);
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.showSideBar = false;
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        // Logout successful
        // Perform any additional actions after logout if neede
        this.authService.removeTokens();
        this.router.navigate(['/auth/sign-in']);
      },
      (error) => {
        // Handle the error
        console.error('Logout failed:', error);
      }
    );
  }
}
