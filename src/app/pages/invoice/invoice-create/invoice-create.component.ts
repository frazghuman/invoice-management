import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { CurrencyService } from '@common/services/currency/currency.service';
import { CustomersService } from '@common/services/customers/customers.service';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { ItemsService } from '@common/services/items/items.service';
import { SelectItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { serverUrl } from 'src/environment';

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
    FormsModule,
    TooltipModule
  ],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss'
})
export class InvoiceCreateComponent {
  fb = inject(FormBuilder);
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  private customersService = inject(CustomersService);
  private itemsService = inject(ItemsService);

  customers!: SelectItem[];
  items!: any[];
  invoiceForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();
  userSettings!: any;

  serverBaseUrl = serverUrl;

  constructor() {
    this.customers = [];
    this.items = [];
    for (let i = 0; i < 10000; i++) {
      this.customers.push({ label: 'Customer ' + i, value: 'Customer ' + i });
      this.items.push({ label: 'Item ' + i, value: {id: i, price: i * 2.5} });
    }

    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
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

    this.customersService.createCustomersList$().subscribe(resp => {
      this.customers = resp.map((customer: any) => {
        return {
          label: `${customer?.name} ${customer?.businessName ? 'Business:' : ''} ${customer?.businessName} ${customer?.nif ? 'NIF:' : ''} ${customer?.nif} ${customer?.cif ? 'CIF:' : ''} ${customer?.cif}`,
          value: customer._id,
          customer
        };
      })
    });

    this.itemsService.getItemsList$().subscribe(resp => {
      this.items = resp.map((item: any) => {
        return {
          label: `${item?.name} (${item?.baseUnitOfMeasure})`,
          value: item._id,
          item
        };
      })
    });

    
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createItem(): FormGroup {
    const itemFormGroup = this.fb.group({
      item: ['', Validators.required],
      price: [{ value: null, disabled: true }, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [{ value: null, disabled: true }]
    });

    itemFormGroup.get('item')?.valueChanges.subscribe(selectedItemId => {
      console.log('Selected Item ID:', selectedItemId); // Log the selected item ID
      const selectedItem = this.items.find((item: any) => item.item._id === selectedItemId);
      console.log('Selected Item:', selectedItem); // Log the selected item
      
      if (selectedItem?.item?.latestPrice?.salePrice) {
        const itemPrice = selectedItem.item.latestPrice.salePrice;
        itemFormGroup.patchValue({
          price: itemPrice
        }, { emitEvent: false });
      } else {
        itemFormGroup.get('price')?.setValue(null);
      }
      itemFormGroup.get('price')?.enable();

      console.log('Item Value', itemFormGroup.value)
      // this.updateItemTotal(itemFormGroup); // Update the total when the item is selected
    });

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
      const itemPrice = itemVlaue?.price || null;
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

  get currencySymbol() {
    if (this.userSettings?.currency) {
      return this.currencyService.getCurrencySymbol(this.userSettings.currency)
    }
    return '€';
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  submitInvoice() {
    if (this.invoiceForm.valid) {
      console.log(this.invoiceForm.value);
    }
  }

}
