import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploaderComponent } from '@common/components/file-uploader/file-uploader.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploaderComponent],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit, OnChanges {
  @Input() data!: any;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  customerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: [''],
      email: [''],
      businessName: [''],
      cif: [''],
      nif: [''],
      address: [''],
      additionalInformation: [''],
      image: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);
      this.customerForm.patchValue(changes['data'].currentValue);
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    if (this.customerForm) {
      this.customerForm.reset();
      this.customerForm.markAsUntouched();
      this.customerForm.markAsPristine();
    }
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.submitEvent.emit(this.customerForm.value);
      console.log(this.customerForm.value);
    }
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  onFileUpload(event: string) {
    this.customerForm.get('image')?.setValue(event);
  }

  get imageUrl() {
    return this.customerForm.get('image')?.value;
  }
}
