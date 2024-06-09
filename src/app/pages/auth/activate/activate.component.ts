import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import User from '@common/interfaces/user.interface';
import { UserManagementService } from '@common/services/user-management/user-management.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { matchingPasswordsValidator, passwordComplexityValidator } from '@common/validators/password.validator';
import { MessageService } from 'primeng/api';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastWrapperModule
  ],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {
  private api = inject(UserManagementService);
  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);
  activationForm!: FormGroup;
  activationKey!: string | null;
  user!: User;

  ngOnInit(): void {
    this.activationForm = this.fb.group(
      {
        email: [{value: '', disabled: true}, Validators.required],
        newPassword: ['', [Validators.required, passwordComplexityValidator()]],
        retypeNewPassword: ['', Validators.required],
      },
      {
        validators: matchingPasswordsValidator('newPassword', 'retypeNewPassword'),
      }
    );

    this.route.paramMap
    .pipe(
      switchMap(params => {
        this.activationKey = params.get('activationKey');
        if (this.activationKey) {
          return this.api.getUserByVerificationKey$(this.activationKey);
        }
        return of(null);
      })
    )
    .subscribe({
      next: (user: User | null) => {
        if (user) {
          this.user = user;
          console.log('User:', user);

          this.activationForm.get('email')?.patchValue(this.user.email);
        } else {
          this.showError('Not Found', 'User not found or has been deleted.');
          this.router.navigate(['not-found']);
        }
      },
      error: (error) => {
        console.error('Error fetching user by activation key:', error);
        this.handleError(error);
        this.router.navigate(['not-found']);
      }
    });
  }
  onSubmit() {
    if (this.activationForm.valid && this.activationKey) {
      this.api.activateUser$(this.activationKey, this.activationForm.value).subscribe({
        next: (resp: any) => {
          if (resp) {
            this.messageService.add({
              severity: 'success',
              summary: 'Activated',
              detail: 'User activated successfully.'
            });
            setTimeout(() => {
              this.router.navigate(['auth/sign-in']);
            }, 0);
          }
        },
        error: (error) => {
          console.error('Error fetching user by activation key:', error);
          this.handleError(error);
        }
      });
    }
  }
  cancel() {}

  showError(summary:string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail
    });
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
