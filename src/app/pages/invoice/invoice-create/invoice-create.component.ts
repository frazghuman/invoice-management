import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { SelectItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    RouterLink,
    RouterLinkActive,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    InputTextareaModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent {
  fb = inject(FormBuilder);
  customers!: SelectItem[];
  items!: SelectItem[];
  invoiceForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor() {
    this.customers = [];
    this.items = [];
    for (let i = 0; i < 10000; i++) {
      this.customers.push({ label: 'Customer ' + i, value: 'Customer ' + i });
      this.items.push({ label: 'Item ' + i, value: {id: i, price: i * 2.5} });
    }
  }

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      invoiceId: [''],
      customer: ['', Validators.required],
      date: [new Date(), Validators.required],
      dueDate: [new Date(), Validators.required],
      items: this.fb.array([this.createItem()]), // Initialize with one item row
      subtotal: [0],
      discount: [null],
      shippingCharges: [null],
      amountDue: [0]
    });

    this.invoiceForm.get('subtotal')?.disable();

    // Subscribe to form changes to calculate totals
    this.invoiceForm.valueChanges.subscribe(() => {
      this.updateTotals();
    });

    this.itemsFormArray.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(300)
    ).subscribe(() => {
      if (this.itemsFormArray.valid) {
        console.log('Add new item')
        this.addItem();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createItem(): FormGroup {
    const itemFormGroup =  this.fb.group({
      item: ['', Validators.required],
      price: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      total: [null]
    });

    // itemFormGroup.get('price')?.disable();
    itemFormGroup.get('total')?.disable();

    return itemFormGroup;
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItem());
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.updateTotals();
  }

  get itemsFormArray(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  updateTotals(): void {
    const items = this.invoiceForm.get('items')?.value;
    let subtotal = 0;
    items.forEach((item: any, itemIndex: number) => {
      const itemVlaue = this.itemsFormArray.at(itemIndex).value;
      const itemPrice = itemVlaue?.item?.price || null;
      this.itemsFormArray.at(itemIndex).patchValue({price: itemPrice}, {emitEvent: false});
      if (this.itemsFormArray.at(itemIndex)?.valid) {
        
        let total = (item.quantity * itemPrice);
        subtotal += total;
        // Check if the itemIndex is within the bounds of the FormArray
        if (itemIndex >= 0 && itemIndex < items.length) {
          // Create an object that represents the field to be patched
          const patchObject = {
            total: total,
            price: itemPrice
          };
  
          // Patch the value of the specific field in the FormGroup at itemIndex
          this.itemsFormArray.at(itemIndex).patchValue(patchObject, {emitEvent: false});
        }
      }
    });

    let discount = this.invoiceForm.get('discount')?.value || 0;
    let shippingCharges = this.invoiceForm.get('shippingCharges')?.value || 0;
    let amountDue = Number(subtotal) - Number(discount) + Number(shippingCharges);

    this.invoiceForm.patchValue({
      subtotal: subtotal,
      amountDue: amountDue
    }, {emitEvent: false}); // Prevent infinite loop
  }

}
