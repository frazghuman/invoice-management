import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { CurrencyService } from '@common/services/currency/currency.service';
import { CustomersService } from '@common/services/customers/customers.service';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { ItemsService } from '@common/services/items/items.service';
import { MessageService, SelectItem } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { serverUrl } from '@environment';
import { InvoicesService } from '@common/services/invoices/invoices.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { Invoice, InvoiceItem } from '@common/interfaces/invoices.interface';

@Component({
  selector: 'app-invoice-edit',
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
    TooltipModule,
    ToastWrapperModule
  ],
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.scss']
})
export class InvoiceEditComponent {
  fb = inject(FormBuilder);
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  private customersService = inject(CustomersService);
  private itemsService = inject(ItemsService);
  private invoicesService = inject(InvoicesService);
  private messageService: MessageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  customers!: SelectItem[];
  items!: any[];
  invoiceForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();
  userSettings!: any;
  invoiceId: string | null = null;
  private paramsSubscription!: Subscription;

  serverBaseUrl = serverUrl;
  invoice!: Invoice;

  constructor() {
    this.customers = [];
    this.items = [];
    for (let i = 0; i < 10000; i++) {
      this.customers.push({ label: 'Customer ' + i, value: 'Customer ' + i });
      this.items.push({ label: 'Item ' + i, value: { id: i, price: i * 2.5 } });
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
      customer: ['', Validators.required],
      date: [new Date(), Validators.required],
      dueDate: [new Date(), Validators.required],
      items: this.fb.array([this.createItem()]), // Initialize with one item row
      subtotal: [0],
      discount: [null],
      shippingCharges: [null],
      amountDue: [0],
      note: ['']
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
        console.log('Add new item');
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
      });
    });

    this.itemsService.getItemsList$().subscribe(resp => {
      this.items = resp.map((item: any) => {
        return {
          label: `${item?.name} (${item?.baseUnitOfMeasure})`,
          value: item._id,
          item
        };
      });
    });

    // React to parameter changes
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      if (typeof this.invoiceId === 'string') {
        this.getInvoiceById(this.invoiceId);
      }
    });
  }

  getInvoiceById(invoiceObjectId: string) {
    this.invoicesService.getInvoice$(invoiceObjectId).subscribe({
      next: (response) => {
        this.invoice = response;

        this.invoice.subTotal = this.calculateSubtotal(this.invoice.items);
        this.invoice.items.forEach(item => {
          this.addItem();
        })

        this.invoiceForm.patchValue(this.transformInvoiceToFormData(this.invoice));
      },
      error: (error) => {
        if (error?.status === 404) {
          this.router.navigate(['not-found']);
        } else {
          console.error('Update failed', error);
          this.handleError(error);
        }
      }
    })
  }

  transformInvoiceToFormData(invoice: Invoice) {
    return {
      customer: invoice.customer._id,
      date: new Date(invoice.date),
      dueDate: new Date(invoice.dueDate),
      items: invoice.items.map(item => ({
        item: item.item._id,
        price: item.price,
        quantity: item.quantity
      })),
      discount: invoice.discount.toString(),
      shippingCharges: invoice.shippingCharges.toString(),
      amountDue: invoice.amountDue,
      note: invoice.note || ''
    };
  }

  calculateSubtotal(items: InvoiceItem[]): number {
    return items.reduce((subtotal, item) => {
      return subtotal + (item.price * item.quantity);
    }, 0);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createItem(): FormGroup {
    const itemFormGroup = this.fb.group({
      item: ['', Validators.required],
      price: [{ value: null, disabled: false }, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [{ value: null, disabled: true }]
    });

    itemFormGroup.get('item')?.valueChanges.subscribe(selectedItemId => {
      console.log('Selected Item ID:', selectedItemId); // Log the selected item ID
      const selectedItem = this.items.find((item: any) => item?.item?._id === selectedItemId);
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

      console.log('Item Value', itemFormGroup.value);
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
      const itemValue = this.itemsFormArray.at(itemIndex).value;
      const itemPrice = itemValue?.price || null;
      this.itemsFormArray.at(itemIndex).patchValue({ price: itemPrice }, { emitEvent: false });
      if (this.itemsFormArray.at(itemIndex)?.valid) {
        let total = item.quantity * itemPrice;
        subtotal += total;
        if (itemIndex >= 0 && itemIndex < items.length) {
          const patchObject = {
            total: total,
            price: itemPrice
          };
          this.itemsFormArray.at(itemIndex).patchValue(patchObject, { emitEvent: false });
        }
      }
    });

    let discount = this.invoiceForm.get('discount')?.value || 0;
    let shippingCharges = this.invoiceForm.get('shippingCharges')?.value || 0;
    let amountDue = Number(subtotal) - Number(discount) + Number(shippingCharges);

    this.invoiceForm.patchValue({
      subtotal: subtotal,
      amountDue: amountDue
    }, { emitEvent: false });
  }

  get currencySymbol() {
    if (this.userSettings?.currency) {
      return this.currencyService.getCurrencySymbol(this.userSettings.currency);
    }
    return '€';
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  submitInvoice() {
    const itemsArray = this.itemsFormArray;
    this.removeItem(itemsArray.length - 1);

    if (this.invoiceForm.valid && this.invoiceForm.value.items.length && this.invoice._id) {
        console.log(this.invoiceForm.value);
        this.updateInvoice(this.invoiceForm.value);
    } else {
        console.log('Form Invalid');
        this.showError('Invoice Invalid', 'Required fields are missing');
    }

    this.addItem(); // Add the last empty item row back
  }

  updateInvoice(data: any) {
    this.invoicesService.updateInvoice$(this.invoice._id, data).subscribe({
      next: (response) => {
        if (response?._id) {
          const { _id } = response;
          this.navigateToInvoice(_id);
        }
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  handleError(errorResp: any) {
    if (errorResp?.error?.message) {
      const { error, message } = errorResp?.error?.message;
      if (error && message) {
        this.showError(error, message);
      }
    }
  }

  showError(summary:string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail
    });
  }

  navigateToInvoice(invoiceId: string | number): void {
    // Navigate to the invoice detail route with the given id
    this.router.navigate(['/invoice', invoiceId]);
  }

}
