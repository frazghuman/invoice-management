import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-receive-stock-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, InputNumberModule],
  templateUrl: './receive-stock-form.component.html',
  styleUrl: './receive-stock-form.component.scss'
})
export class ReceiveStockFormComponent implements OnInit, OnChanges {
  private fb: FormBuilder = inject(FormBuilder);
  @Input() data!: any;
  @Input() itemId!: any;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  receiveStockForm!: FormGroup;

  ngOnInit() {

    this.receiveStockForm = this.fb.group({
      itemId: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{24}$/)]],
      lotNo: ['', [Validators.required, Validators.min(0)]],
      purchasePrice: ['', [Validators.required, Validators.min(0.01)]],
      totalStock: ['', [Validators.required, Validators.min(0.01)]],
      stockReceivedDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);

      // this.priceAdjustmentForm.patchValue(price);

    } else {
      this.resetForm();
    }

    if (!changes['itemId'].firstChange && changes['itemId'].currentValue) {
      const itemId = changes['itemId'].currentValue;
      console.log('changes: ', changes['itemId'].currentValue);
      this.receiveStockForm.get('itemId')?.setValue(itemId);
      // this.priceAdjustmentForm.patchValue(price);

    }
  }

  resetForm() {
    
  }

  onCancel() {}

  onSubmit() {}
}
