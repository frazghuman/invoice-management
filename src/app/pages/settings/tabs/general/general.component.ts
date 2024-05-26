import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject, OnInit } from '@angular/core';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { SettingsService } from '@common/services/settings/settings.service';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { serverUrl } from 'src/environment';
import { GeneralSettingsComponent } from './general-settings-form/general-settings.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { CurrencyService } from '@common/services/currency/currency.service';
import { AccountResetPasswordComponent } from '@pages/settings/forms/account-reset-password/account-reset-password.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    ToastWrapperModule,
    ConfirmDialogWrapperModule,
    GeneralSettingsComponent,
    AccountResetPasswordComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private dataSharingService = inject(DataSharingService);
  private userSettingsService = inject(SettingsService);
  private currencyService = inject(CurrencyService);
  
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  showUpdateDialog: boolean = false;
  showResetPasswordDialog: boolean = false;

  userSettings: any;
  serverBaseUrl: any = serverUrl;

  now = new Date();
  fieldName!: string;

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit(): void {
    this.settingsService.getUserSettings$().subscribe()
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  getCurrencySymbolByCode(code: string) {
    return this.currencyService.getCurrencySymbol(code)
  }

  onHideUpdateDialog(flag: boolean) {
    this.showUpdateDialog = flag;
  }

  onHideResetPasswordDialog(flag: boolean) {
    this.showResetPasswordDialog = flag;
  }

  onShowResetPasswordDialog() {
    this.showResetPasswordDialog = true;
  }

  onEdit(fieldName: string) {
    this.fieldName = fieldName;
    this.showUpdateDialog = true;
  }

  onCancel(event: boolean) {
    if (event) {
      this.showUpdateDialog = false;
    }
  }

  onSubmit(formData: any): void {
    if (formData) {
      // You can also call a service method to save the updated settings
      this.userSettingsService.updateUserSettings(formData)
      .subscribe({
        next: (response) => {
          if (response) {
            this.settingsService.getUserSettings$().subscribe();
            this.showMessage('Success', 'Updated Successfully.', 'success')
            this.showUpdateDialog = false;
          }
        },
        error: (error) => {
          console.error('Update failed', error);
          this.handleError(error);
        }
      });
    }
  }

  showMessage(summary:string, detail: string, severity: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }

  showError(summary:string, detail: string) {
    this.showMessage(summary, detail, 'error');
  }

  handleError(errorResp: any) {
    if (errorResp?.error?.message) {
      const { error, message } = errorResp?.error?.message;
      if (error && message) {
        this.showError(error, message);
      }
    }
  }
}
