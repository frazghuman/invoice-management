import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent {
  @Input() data!: any;

  itemForm!: FormGroup;
  unitTypes: string[] = ['Carton', 'Role', 'Kg', 'Litter'];

  constructor() {
  }

  ngOnInit() {
    this.itemForm = new FormGroup({
      itemName: new FormControl('', [Validators.required]),
      lotNo: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      totalStock: new FormControl('', [Validators.required]),
      unitType: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });
  }

  onSubmit() {
    console.log(this.itemForm.value);
  }
}
