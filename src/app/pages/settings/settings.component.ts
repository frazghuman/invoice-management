import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { TabViewModule } from 'primeng/tabview';
import { GeneralComponent } from './tabs/general/general.component';
import { UserManagementComponent } from './tabs/user-management/user-management.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ConfirmDialogComponent,
    GeneralComponent,
    UserManagementComponent,
    TabViewModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  showUpdateDialog: boolean = false;

  onHideUpdateDialog(event: any) {

  }
}
