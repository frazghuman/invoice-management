import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-lot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-lot.component.html',
  styleUrl: './add-lot.component.scss'
})
export class AddLotComponent {
  itemForm!: FormGroup;
  unitTypes: string[] = ['Carton', 'Role', 'Kg', 'Litter'];

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
