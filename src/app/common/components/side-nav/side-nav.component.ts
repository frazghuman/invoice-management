import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BackdropService } from '@common/services/signals/backdrop.service';
import { AuthService } from '@common/services/auth/auth.service';
import { SettingsService } from '@common/services/settings/settings.service';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { serverUrl } from '@environment';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { GeneralSettingsComponent } from '@pages/settings/tabs/general/general-settings-form/general-settings.component';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { BaseComponent } from '../base/base.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastWrapperModule,
    SvgIconComponent,
    ConfirmDialogComponent,
    GeneralSettingsComponent,
    TooltipModule,
    TranslateModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent extends BaseComponent implements OnInit, OnDestroy {
  backDropService = inject(BackdropService);
  messageService = inject(MessageService);
  translate: TranslateService = inject(TranslateService);
  showSideBar: boolean = false;
  showCompanySelectionDialog: boolean = false;
  userSettings: any;
  serverBaseUrl: any = serverUrl;
  fieldName!: string;
  routerEventsSubscription: Subscription;
  toggleSidebar() {
    this.showSideBar = !this.showSideBar;
    this.backDropService.set('visible', this.showSideBar);
  }

  language = {
    "English": "en",
    "Spanish": "es"
  }

  constructor(
    protected override authService: AuthService,
    private router: Router,
    private settingsService: SettingsService,
    private dataSharingService: DataSharingService
  ) {
    super(authService);
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
      if (this.userSettings && !this.userSettings?.company) {
        this.onEdit('company');
      }
      if (this.userSettings?.language) {
        let selectedLanguage: string;
        switch (this.userSettings?.language) {
          case 'English':
            selectedLanguage = 'en';
            break;
          case 'Spanish':
              selectedLanguage = 'es';
              break;
        
          default:
            selectedLanguage = 'en';
            break;
        }

        this.translate.setDefaultLang(selectedLanguage);
      }
    }, options);

    this.routerEventsSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSideBar = false;
        this.backDropService.set('visible', this.showSideBar);
      }
    });
  }

  ngOnInit() {
    this.showSideBar = false;
    this.settingsService.getUserSettings$().subscribe();
    this.settingsService.getUserCompanies$().subscribe();
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

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  onHideCompanySelectionDialog(flag: boolean) {
    this.showCompanySelectionDialog = false;
  }

  onEdit(fieldName: string) {
    this.fieldName = fieldName;
    this.showCompanySelectionDialog = true;
  }

  onSubmitUserSettings(formData: any) {
    if (formData) {
      // You can also call a service method to save the updated settings
      this.settingsService.updateUserSettings(formData)
      .subscribe({
        next: (response) => {
          if (response) {
            this.settingsService.getUserSettings$().subscribe(() => {
              if (this.fieldName === 'company') {
                this.showMessage('Success', 'Company Updated.', 'success')
                this.router.navigate(['/'])
              }
            });
            this.showCompanySelectionDialog = false;
            
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

  ngOnDestroy(): void {
    this.routerEventsSubscription.unsubscribe();
  }
}
