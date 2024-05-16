import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@common/services/auth/auth.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  constructor(protected authService: AuthService) {}
  
  userHasPermission(permissionRule: string) {
    return !!this.authService.hasPermission(permissionRule)
  }
}
