import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploaderComponent } from '@common/components/file-uploader/file-uploader.component';
import { SelectItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule, FileUploaderComponent],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent {
  @Input() data!: any;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  itemForm!: FormGroup;
  units: SelectItem[] = [
    { label: 'Kilogram', value: 'Kilogram' },
    { label: 'Meter', value: 'Meter' },
    { label: 'Liter', value: 'Liter' },
    { label: 'Carton', value: 'Carton' },
    { label: 'Role', value: 'Role' },
    { label: 'Bag', value: 'Bag' },
    // predefined units
  ];
  filteredUnits!: any[];
  selectedUnit!: string;

  constructor() {
  }

  ngOnInit() {
    this.itemForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      baseUnitOfMeasure: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      image: new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);
      this.itemForm.patchValue(changes['data'].currentValue);
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    if (this.itemForm) {
      this.itemForm.reset();
      this.itemForm.markAsUntouched();
      this.itemForm.markAsPristine();
    }
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;

      this.submitEvent.emit({
        ...formData,
        baseUnitOfMeasure: formData.baseUnitOfMeasure.value ?? formData.baseUnitOfMeasure
      });
      console.log(this.itemForm.value);
    }
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  onFileUpload(event: string) {
    this.itemForm.get('image')?.setValue(event);
  }

  get imageUrl() {
    return this.itemForm.get('image')?.value;
  }

  filterUnits(event: any) {
    let query = event.query;
    this.filteredUnits = this.units.filter(unit => unit?.label?.toLowerCase().includes(query.toLowerCase()));
  }

  onSelect(event: any) {
    // Directly set the value part to the form control
    if (this.itemForm.get('baseUnitOfMeasure')) {
      this.itemForm.get('baseUnitOfMeasure')?.setValue(event.value);
    }
  }

  // onInputBlur(event: any) {
  //   this.selectedUnit = this.itemForm.get('baseUnitOfMeasure')?.value;
  //   this.addUnitIfNotExist(this.selectedUnit);
  // }

  onEnterPress(event: any) {
    this.selectedUnit = this.itemForm.get('baseUnitOfMeasure')?.value;
    event.preventDefault();  // Prevent the default form submit behavior
    this.addUnitIfNotExist(this.selectedUnit);
  }

  addUnitIfNotExist(newUnit: string) {
    if (newUnit && !this.units.some(unit => unit?.label?.toLowerCase() === newUnit.toLowerCase())) {
      this.units.push({ label: newUnit, value: newUnit });
      this.selectedUnit = newUnit;  // Optionally reset the model or keep the new value
    }
  }
}
