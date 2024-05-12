import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploaderComponent } from '@common/components/file-uploader/file-uploader.component';
import { CompaniesManagementPaginator, Company } from '@common/interfaces/companies-management.interface';
import { User } from '@common/interfaces/user-management.interface';
import { CustomCapitalizePipe } from '@common/pipes/custom-capitalize.pipe';
import { CompaniesManagementService } from '@common/services/companies-management/companies-management.service';
import { RolesService } from '@common/services/roles/roles.service';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, MultiSelectModule, FileUploaderComponent],
  providers: [CustomCapitalizePipe],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() data!: any;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  userForm!: FormGroup;

  availableRoles: any[] = [];

  availableCompanies: any[] = [];

  constructor(
    private readonly companiesManagementService: CompaniesManagementService,
    private readonly rolesService: RolesService,
    private readonly customCapitalizePipe: CustomCapitalizePipe
  ) {}

  ngOnInit() {
    this.initForm();
    this.companiesManagementService.getAllCompaniesManagement$().subscribe((value: CompaniesManagementPaginator) => {
      this.availableCompanies = value.companies.map((company: Company) => {
        return { value: company._id, label: company.name};
      });
    })

    this.rolesService.getAllRoles$().subscribe((value: any) => {
      this.availableRoles = value.roles.map((role: Company) => {
        return { value: role._id, label: this.customCapitalizePipe.transform(role.name)};
      });
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);
      this.userForm.patchValue(this.transformUserData(changes['data'].currentValue));
    } else {
      this.resetForm();
    }
  }

  private initForm() {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      companiesAccess: new FormControl([], Validators.required),
      image: new FormControl(''),
    });
  }

  resetForm() {
    if (this.userForm) {
      this.userForm.reset();
      this.userForm.markAsUntouched();
      this.userForm.markAsPristine();
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.submitEvent.emit(this.userForm.value);
      // console.log(this.userForm.value);
    }
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  onFileUpload(event: string) {
    this.userForm.get('image')?.setValue(event);
  }

  get imageUrl() {
    return this.userForm.get('image')?.value;
  }

  transformUserData(user: User): any {
    // Extract the role ID if the role object is present and has an _id property
    const roleId = user?.role?._id || null;
  
    // Extract the company IDs if companiesAccess is present and is an array
    const companyIds = Array.isArray(user?.companiesAccess)
      ? user.companiesAccess.map((company: Company) => company._id)
      : [];

    const { role, companiesAccess, ...otherProperties } = user;
  
    return {
      ...otherProperties,
      role: roleId,
      companiesAccess: companyIds,
    };
  }
}
