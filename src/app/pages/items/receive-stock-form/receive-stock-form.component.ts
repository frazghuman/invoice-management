import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService } from '@common/services/currency/currency.service';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
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
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  userSettings!: any;
  private inventoryService = inject(InventoryService);
  private fb: FormBuilder = inject(FormBuilder);
  @Input() data!: any;
  @Input() itemId!: any;
  @Input() selectedItem!: any;
  @Input() nextLotNo!: number;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  receiveStockForm!: FormGroup;
  minDate: Date = new Date();

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

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
      this.receiveStockForm.get('item')?.setValue(itemId);
    }
    
    if (changes['nextLotNo'] && !changes['nextLotNo'].firstChange && changes['nextLotNo'].currentValue) {
      const nextLotNo = changes['nextLotNo'].currentValue;
      console.log('changes: nextLotNo ', nextLotNo);
      this.updateMinLotNoValidator(nextLotNo);
      this.receiveStockForm.get('lotNo')?.setValue(nextLotNo);
      this.receiveStockForm.get('lotNo')?.enable();

      if(!!this.itemId && !this.receiveStockForm.get('item')?.value) {
        this.receiveStockForm.get('item')?.setValue(this.itemId);
      }

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

  get currencySymbol() {
    if (this.userSettings?.currency) {
      return this.currencyService.getCurrencySymbol(this.userSettings.currency)
    }
    return '€';
  }
}
