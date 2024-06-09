import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CreateEffectOptions, effect, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { InvoicesPaginator } from '@common/interfaces/invoices.interface';
import { InvoicesService } from '@common/services/invoices/invoices.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { BehaviorSubject, debounceTime, Observable, scan, Subject, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { CurrencyService } from '@common/services/currency/currency.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    PageHeaderComponent,
    CustomCurrencyPipe,
    InputNumberModule
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {
  private api = inject(InvoicesService);
  private router = inject(Router);
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  userSettings!: any;

  public paginator$!: Observable<InvoicesPaginator>;
  private searchSubject = new Subject<string>();

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  actionInvoices!: MenuItem[];

  showUpdateDialog: boolean = false;
  selectedInvoice: any;

  sortOptions!: MenuItem[];
  private params: any = {};

  options = [
    {label: 'Customer', value: 'customer'},
    {label: 'Issued Date', value: 'date'},
    {label: 'Due Date', value: 'dueDate'},
    {label: 'Amount', value: 'amountDue'}
    // Add more options as needed
  ];

  selectedOption: any = {label: 'Customer', value: 'customer'}; // Initially no option is selected

  searchValue: any;

  constructor() {
    this.paginator$ = this.loadInvoices$();

    this.params['searchField'] = this.selectedOption.value;

    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit() {
    this.sortOptions = [
      { label: 'Customer Name: A to Z', icon: 'pi pi-sort-alpha-down', command: () => this.sort('customerNameAsc') },
      { label: 'Customer Name: Z to A', icon: 'pi pi-sort-alpha-up', command: () => this.sort('customerNameDesc') },
      { label: 'Invoice: Old to New', icon: 'pi pi-sort-numeric-down', command: () => this.sort('InvoiceNoAsc') },
      { label: 'Invoice: New to Old', icon: 'pi pi-sort-numeric-up', command: () => this.sort('InvoiceNoDesc') },
      { label: 'Issued Date: Old to New', icon: 'pi pi-sort-amount-down', command: () => this.sort('issuedDateAsc') },
      { label: 'Issued Date: New to Old', icon: 'pi pi-sort-amount-up', command: () => this.sort('issuedDateDesc') },
      { label: 'Due Date: Old to New', icon: 'pi pi-sort-amount-down', command: () => this.sort('dueDateAsc') },
      { label: 'Due Date: New to Old', icon: 'pi pi-sort-amount-up', command: () => this.sort('dueDateDesc') },
      { label: 'Amount: Low to High', icon: 'pi pi-sort-amount-down', command: () => this.sort('amountAsc') },
      { label: 'Amount: High to Low', icon: 'pi pi-sort-amount-up', command: () => this.sort('amountDesc') }
    ];

    this.searchSubject.pipe(
      debounceTime(700)  // Wait for 300ms pause in events
    ).subscribe(searchText => {
      console.log('Search query:', searchText);
      this.params['search'] = searchText;

      console.log('searchParams', this.params);
      this.page$.next(1);
      window.scrollTo(0, 0); 
    });
  }

  onSearch(event: KeyboardEvent | null = null): void {
    if (this.selectedOption.value === 'amountDue' && !this.searchValue) {
      this.searchValue = '';
    }
    if (event && this.selectedOption.value === 'customer') {
      const inputElement = event.target as HTMLInputElement;
      this.searchSubject.next(inputElement.value.trim());  // Emit the trimmed value
    } if (event && this.selectedOption.value === 'amountDue') {
      this.searchSubject.next(this.searchValue);  // Emit the trimmed value
    } else {
      this.searchSubject.next(this.searchValue);  // Emit the trimmed value
    }
  }

  sort(criteria: string) {
    // Implement your sorting logic here based on the criteria
    console.log(`Sorting by ${criteria}`);
  }

  private loadInvoices$(): Observable<InvoicesPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getInvoices$(this.params, page)),
      scan(this.updatePaginator, {invoices: [], page: 0, hasMorePages: true} as InvoicesPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: InvoicesPaginator, value: InvoicesPaginator): InvoicesPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.invoices.push(...value.invoices);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreInvoices(paginator: InvoicesPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }

  generateMenuInvoices(event: MouseEvent, invoice: any, index: number) {
    event.preventDefault();
    event.stopPropagation();

    this.actionInvoices = [
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(event, invoice, index)
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => this.deleteAction(event, invoice, index)
      }
    ]
  }

  updateAction(event: MouseEvent, invoice: any, index: number) {
    event.stopPropagation();
    event.preventDefault();


    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, invoice);
    this.selectedInvoice = invoice;
    this.navigateToEditInvoice(invoice._id);
  }

  deleteAction(event: MouseEvent, invoice: any, index: number) {
    event.stopPropagation();
    event.preventDefault();


      // Your delete logic here
      console.log('Delete action triggered'+index, invoice);
  }

  onAddInvoice(event: any) {
    this.showUpdateDialog = true;
    this.selectedInvoice = null;
  }

  onSearchClick() {}

  onFilterChange(event: any) {
    this.searchValue = undefined;
    this.params['searchField'] = this.selectedOption.value;
  }

  onAddItem(event: any) {
    this.router.navigate(['invoice/create'])
  }

  navigateToInvoice(invoiceId: string | number): void {
    // Navigate to the invoice detail route with the given id
    this.router.navigate(['/invoice', invoiceId]);
  }

  navigateToEditInvoice(id: string): void {
    this.router.navigate([`/invoice/${id}/edit`]);
  }

  get currencySymbol() {
    if (this.userSettings?.currency) {
      return this.currencyService.getCurrencySymbol(this.userSettings.currency)
    }
    return '€';
  }

}
