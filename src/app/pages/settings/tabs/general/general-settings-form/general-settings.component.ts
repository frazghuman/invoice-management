import { CommonModule, DatePipe } from '@angular/common';
import { Component, CreateEffectOptions, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploaderComponent } from '@common/components/file-uploader/file-uploader.component';
import { CompaniesManagementService } from '@common/services/companies-management/companies-management.service';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { SettingsService } from '@common/services/settings/settings.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, FileUploaderComponent, ToastWrapperModule],
  providers: [DatePipe],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss'
})
export class GeneralSettingsComponent {
  private dataSharingService = inject(DataSharingService);
  private companiesManagementService = inject(CompaniesManagementService);
  private messageService = inject(MessageService);
  
  @Input() fieldName!: string;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();
  userSettingsForm!: FormGroup;

  userSettings: any;

  cLogoUrl!: string;

  now: Date = new Date();

  countries: any[] = [
    {
      label: 'Spain',
      value: 'Spain'
    },
    {
      label: 'UK',
      value: 'UK'
    }
  ]

  languages: any[] = [
    {
      label: 'Spanish',
      value: 'Spanish'
    },
    {
      label: 'English',
      value: 'English'
    }
  ]

  currencies: any[] = [
    {
      label: 'US Dollor',
      value: 'USD'
    },
    {
      label: 'Euro',
      value: 'EUR'
    }
  ]

  dateFormatsList: string[] = ['dd MMM yyyy', 'dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy', 'MMMM dd, yyyy', 'dd-MM-yyyy'];
  dateFormats: any[] = [
  ]
  userCompanies: any[] = [];
  companies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
      // Fetch initial data and populate the form
      const data = this.userSettings;
      if (data) {
        this.userSettingsForm.patchValue({
          user: data.user._id,
          userImage: !!data?.userImage ? data?.userImage : data?.user?.image,
          userName: !!data?.userName ? data?.userName : data?.user?.name,
          company: data?.company?._id,
          country: data.country,
          language: data.language,
          dateFormat: data.dateFormat,
          currency: data.currency,
          currencyFormat: data.currencyFormat,
        });

        this.cLogoUrl = data?.company?.logo;
      }

      this.userCompanies = this.dataSharingService.userCompanies();
      if (this.userCompanies?.length) {
        this.companies = this.userCompanies.map((userCompany: any) => {
          return {
            label: userCompany.name,
            value: userCompany._id
          }
        })
      }
    }, options);

    for(let dateFormat of this.dateFormatsList) {
      this.dateFormats.push({
        label: this.datePipe.transform(this.now, dateFormat),
        value: dateFormat
      });
    }

  }

  ngOnInit(): void {
    this.userSettingsForm = this.fb.group({
      user: ['', Validators.required],
      userImage: [''],
      userName: [''],
      company: [''],
      country: [''],
      language: [''],
      dateFormat: [''],
      currency: [''],
      currencyFormat: [''],
    });
  }

  onFileUpload(event: string) {
    this.userSettingsForm.get('userImage')?.setValue(event);
  }

  get imageUrl() {
    return this.userSettingsForm.get('userImage')?.value;
  }

  onCompanyLogoUpload(logoUrl: string) {
    console.log(logoUrl);
    this.cLogoUrl = logoUrl;
  }

  get companyLogoUrl() {
    return this.userSettings?.company?.logo ?? '';
  }

  onSubmit() {
    if (this.fieldName === 'companyLogo') {
      const companyId = this.userSettingsForm.get('company')?.value;
      this.companiesManagementService.updateCompanyLogo$(companyId, {logo: this.cLogoUrl})
      .subscribe({
        next: (response) => {
          if (response) {
            this.showMessage('Success', 'Updated Successfully.', 'success')
          }
          if (this.userSettings?.company) {
            this.userSettings.company['logo'] = this.cLogoUrl;
            this.dataSharingService.setUserSettings(this.userSettings);
            this.closeDialog();
          }
        },
        error: (error) => {
          console.error('Update failed', error);
          this.handleError(error);
        }
      });
    } else {
      if (this.userSettingsForm.valid) {
        this.submitEvent.emit(this.userSettingsForm.value);
        // console.log(this.userForm.value);
      }
    }
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  closeDialog() {
    this.cancelEvent.emit(true);
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
