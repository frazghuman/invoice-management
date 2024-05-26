import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { UserManagementService } from '@common/services/user-management/user-management.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { matchingPasswordsValidator, passwordComplexityValidator } from '@common/validators/password.validator';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastWrapperModule],
  templateUrl: './account-reset-password.component.html',
  styleUrl: './account-reset-password.component.scss'
})
export class AccountResetPasswordComponent implements OnInit {
  @Output() cancelEvent = new EventEmitter<any>();

  private dataSharingService = inject(DataSharingService);
  private userManagementService = inject(UserManagementService);
  private messageService = inject(MessageService);
  resetPasswordForm!: FormGroup;
  userSettings!: any;

  constructor(private fb: FormBuilder) {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };

    effect(() => {
      
      this.userSettings = this.dataSharingService.userSettings();
      // Fetch initial data and populate the form
      const data = this.userSettings;
      if (data) {
        this.resetPasswordForm.get('userId')?.setValue(data.user._id)
      }
    }, options);
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        userId: ['', Validators.required],
        password: ['', Validators.required],
        newPassword: ['', [Validators.required, passwordComplexityValidator()]],
        retypeNewPassword: ['', Validators.required],
      },
      {
        validators: matchingPasswordsValidator('newPassword', 'retypeNewPassword'),
      }
    );
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      // Handle form submission
      console.log('Form submitted', this.resetPasswordForm.value);
      const resetPasswordFormData = this.resetPasswordForm.value;
      this.userManagementService.resetPassword$(resetPasswordFormData.userId, resetPasswordFormData)
      .subscribe({
        next: (response) => {
          if (response) {
            this.showMessage('Success', 'Password Successfully updated.', 'success')
            this.cancel();
          }
        },
        error: (error) => {
          console.error('Update failed', error);
          this.handleError(error);
        }
      });
    }
  }

  cancel(): void {
    // Handle cancel action
    this.cancelEvent.emit(false);
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
