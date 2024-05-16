import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '@common/interfaces/items.interface';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-sale-price-adjustment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, InputNumberModule],
  templateUrl: './sale-price-adjustment-form.component.html',
  styleUrl: './sale-price-adjustment-form.component.scss'
})
export class SalePriceAdjustmentFormComponent implements OnInit, OnChanges {
  @Input() data!: Item;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();
  priceAdjustmentForm!: FormGroup;
  minDate!: Date;

  constructor() {
  }

  ngOnInit() {
    this.minDate = new Date();

    this.priceAdjustmentForm = new FormGroup({
      salePrice: new FormControl(null, [Validators.required, Validators.min(0)]),
      effectiveDate: new FormControl(new Date(), [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);

      let price = {salePrice: null, effectiveDate: new Date()};
      const effectivePrice = changes['data'].currentValue?.latestPrice;
      if (effectivePrice) {
        const {salePrice, effectiveDate} = effectivePrice;
        
        price = {salePrice: salePrice ?? 0, effectiveDate: new Date(effectiveDate) ?? new Date()}
      }

      this.priceAdjustmentForm.patchValue(price);

    } else {
      this.resetForm();
    }
  }

  resetForm() {
    if (this.priceAdjustmentForm) {
      this.priceAdjustmentForm.reset();
      this.priceAdjustmentForm.markAsUntouched();
      this.priceAdjustmentForm.markAsPristine();
    }
  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  onSubmit() {
    if (this.priceAdjustmentForm.valid) {
      this.submitEvent.emit(this.priceAdjustmentForm.value);
    }
  }
}
