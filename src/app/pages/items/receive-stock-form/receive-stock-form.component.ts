import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '@common/services/inventory/inventory.service';
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
  private inventoryService = inject(InventoryService);
  private fb: FormBuilder = inject(FormBuilder);
  @Input() data!: any;
  @Input() itemId!: any;
  @Input() selectedItem!: any;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  receiveStockForm!: FormGroup;
  minDate: Date = new Date();

  ngOnInit() {

    this.receiveStockForm = this.fb.group({
      item: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{24}$/)]],
      lotNo: [1, [Validators.required, Validators.min(1)]],
      purchasePrice: [0.01, [Validators.required, Validators.min(0.01)]],
      totalStock: [0, [Validators.required, Validators.min(1)]],
      stockReceivedDate: new FormControl(new Date(), [Validators.required]),
      description: new FormControl('')
    });

    this.receiveStockForm.get('lotNo')?.disable();
    this.receiveStockForm.get('stockReceivedDate')?.setValue(this.minDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange && changes['data'].currentValue) {
      console.log('changes: ', changes['data'].currentValue);
      const stockReceived: any = changes['data'].currentValue;
      stockReceived.stockReceivedDate = new Date(stockReceived.stockReceivedDate);

      this.receiveStockForm.patchValue(stockReceived);
      this.receiveStockForm.get('lotNo')?.disable();
      
    } else {
      this.resetForm();
    }
    
    if (changes['itemId'] && !changes['itemId'].firstChange && changes['itemId'].currentValue) {
      const itemId = changes['itemId'].currentValue;
      console.log('changes: ', changes['itemId'].currentValue);
      this.receiveStockForm.get('lotNo')?.setValue(null);
      this.receiveStockForm.get('lotNo')?.disable();
      this.receiveStockForm.get('item')?.setValue(itemId);
      // this.priceAdjustmentForm.patchValue(price);
      this.inventoryService.largestLotNo$(itemId).subscribe(largestLotNo => {
        console.log('largestLotNo', largestLotNo);
        this.updateMinLotNoValidator(largestLotNo + 1);
        this.receiveStockForm.get('lotNo')?.setValue(largestLotNo + 1);
        this.receiveStockForm.get('lotNo')?.enable();
      })

    }
  }

  updateMinLotNoValidator(minValue: number): void {
    const lotNoControl = this.receiveStockForm.get('lotNo');
    if (lotNoControl) {
      lotNoControl.setValidators([Validators.required, Validators.min(minValue)]);
      lotNoControl.updateValueAndValidity();
    }
  }

  resetForm() {
    if (this.receiveStockForm) {
      this.receiveStockForm.reset();
      this.receiveStockForm.markAsUntouched();
      this.receiveStockForm.markAsPristine();
    }
  }

  onCancel() {
    this.cancelEvent.emit(true);
  }

  onSubmit() {
    if (this.receiveStockForm.valid) {
      this.submitEvent.emit(this.receiveStockForm.value);
    }
  }
}
