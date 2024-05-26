import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { TabViewModule } from 'primeng/tabview';
import { GeneralComponent } from './tabs/general/general.component';
import { UserManagementComponent } from './tabs/user-management/user-management.component';
import { CompaniesManagementComponent } from './tabs/companies-management/companies-management.component';
import { BaseComponent } from '@common/components/base/base.component';
import { AuthService } from '@common/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ConfirmDialogComponent,
    GeneralComponent,
    UserManagementComponent,
    CompaniesManagementComponent,
    TabViewModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent extends BaseComponent {
  activeIndex = 0; // Default to the first tab

  constructor(protected override authService: AuthService) {
    super(authService);
  }

  showUpdateDialog: boolean = false;

  onHideUpdateDialog(event: any) {

  }
}
