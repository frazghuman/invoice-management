import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@common/services/auth/auth.service';
import { LoaderService } from '@common/services/loader/loader.service';
import { ToastWrapperModule } from '@common/shared/toast.module';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastWrapperModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signInForm: FormGroup;
  errorMessage: any;
  isSubmitted = false;

  loaderService = inject(LoaderService);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.signInForm.statusChanges.subscribe((value: any) => {
      this.errorMessage = '';
      this.isSubmitted = false;
    })
  }

  get waiting(): boolean {
    return this.loaderService.waiting();
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.loaderService.toggleWaiting(true)
      this.isSubmitted = true;
      const formData = this.signInForm.value;

      const email = formData.email;
      const password = formData.password;

      this.authService.login(email, password).subscribe(
        (response: any) => {
          this.loaderService.toggleWaiting(false)
          // Assuming the response contains the accessToken and refreshToken
          const { access_token, refresh_token } = response.accessToken;
          this.authService.setTokens(access_token, refresh_token);
          this.router.navigate(['/']);
        },
        (error: any) => {
          if (error?.status === 401) {
            // Handle unauthorized error
            this.errorMessage = error?.error?.message?.message;
            // Display or handle the error message as needed
          } else {
            // Handle other errors
            console.error(error);
            this.errorMessage = 'Invalid Credentials'
          }
        }
      );
      // Handle form submission here
    } else {
      this.errorMessage = 'Invalid Credentials';
    }
  }
}
