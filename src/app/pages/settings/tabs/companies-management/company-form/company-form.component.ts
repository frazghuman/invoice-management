import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploaderComponent } from '@common/components/file-uploader/file-uploader.component';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploaderComponent],
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.scss'
})
export class CompanyFormComponent implements OnInit, OnChanges {
  @Input() data!: any;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  companyForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);
      this.companyForm.patchValue(changes['data'].currentValue);
    } else {
      this.resetForm();
    }
  }

  private initForm() {
    this.companyForm = new FormGroup({
      name: new FormControl(this.data ? this.data.name : '', Validators.required),
      email: new FormControl(this.data ? this.data.email : '', [Validators.required, Validators.email]),
      phone: new FormControl(this.data ? this.data.phone : ''),
      businessNo: new FormControl(this.data ? this.data.businessNo : ''),
      address: new FormControl(this.data ? this.data.address : ''),
      cif: new FormControl(this.data ? this.data.cif : ''),
      logo: new FormControl(this.data?.logo ? this.data.logo : ''),
    });
  }

  resetForm() {
    if (this.companyForm) {
      this.companyForm.reset();
      this.companyForm.markAsUntouched();
      this.companyForm.markAsPristine();
    }
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.submitEvent.emit(this.companyForm.value);
      // console.log(this.companyForm.value);
    }
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  onFileUpload(event: string) {
    this.companyForm.get('logo')?.setValue(event);
  }

  get logoUrl() {
    return this.companyForm.get('logo')?.value;
  }
}
