import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { CustomersPaginator } from '@common/interfaces/customers.interface';
import { CustomersService } from '@common/services/customers/customers.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BehaviorSubject, debounceTime, Observable, scan, Subject, switchMap, tap } from 'rxjs';
import { MenuModule } from 'primeng/menu';

import * as _ from 'lodash';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { ShowMoreDirective } from '@common/directives/show-more.directive';
import fadeInOutAnimation from '@common/animations/fade-in-out.animation';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { serverUrl } from 'src/environment';
import { parseSortString } from '@common/funtions/parse-sort-string';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    ConfirmDialogWrapperModule,
    ToastWrapperModule,
    MenuModule,
    PageHeaderComponent,
    ConfirmDialogComponent,
    CustomerFormComponent,
    ShowMoreDirective
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  animations: [fadeInOutAnimation]
})
export class CustomersComponent implements OnInit {
  private api = inject(CustomersService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  public paginator$: Observable<CustomersPaginator>;
  private searchSubject = new Subject<string>();

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);
  private params: any = {};

  actionItems!: MenuItem[];
  sortOptions!: MenuItem[];
  sortOrder: string = 'nameAsc';
  
  selectedSortOrderIcon: string = this.iconOfSelectedSortOrder;
  selectedSortOrderLabel: string = this.labelBySelectedSortOrder;

  showUpdateDialog: boolean = false;
  selectedCustomer: any;

  expandCustomerDetail: any = {};

  serverBaseUrl = serverUrl;

  constructor() {
    this.paginator$ = this.loadCustomers$();
  }

  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Name: A to Z', icon: 'pi pi-sort-alpha-down', command: () => this.sort('nameAsc') },
      { label: 'Name: Z to A', icon: 'pi pi-sort-alpha-up', command: () => this.sort('nameDesc') }
    ];

    this.searchSubject.pipe(
      debounceTime(300)  // Wait for 300ms pause in events
    ).subscribe(searchText => {
      console.log('Search query:', searchText);
      this.params['search'] = searchText;
      this.page$.next(1);
      window.scrollTo(0, 0); 
    });
  }

  onSearch(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value.trim());  // Emit the trimmed value
  }

  sort(criteria: string) {
    // Implement your sorting logic here based on the criteria
    console.log(`Sorting by ${criteria}`);
    this.sortOrder = criteria;
    this.selectedSortOrderIcon = this.iconOfSelectedSortOrder;
    this.selectedSortOrderLabel = this.labelBySelectedSortOrder;

    const sortParams = parseSortString(this.sortOrder);
    this.params['orderBy'] = sortParams.orderBy;
    this.params['sortOrder'] = sortParams.sortOrder;
    this.page$.next(1);
    window.scrollTo(0, 0); 
  }

  get iconOfSelectedSortOrder() {
    let icon = 'sort'
    switch (this.sortOrder) {
      case 'nameAsc':
        icon = 'pi pi-sort-alpha-down';
      break;
      case 'nameDesc':
        icon = 'pi pi-sort-alpha-up';
      break;
    
      default:
        icon = 'pi pi-sort-alpha-down'
        break;
    }

    return icon;
  }

  get labelBySelectedSortOrder() {
    let label = 'Name: A to Z'
    switch (this.sortOrder) {
      case 'nameAsc':
        label = 'Name: A to Z';
      break;
      case 'nameDesc':
        label = 'Name: Z to A';
      break;
    
      default:
        label = 'Name: A to Z'
        break;
    }

    return label;
  }

  onHideUpdateDialog(flag: boolean) {
    this.showUpdateDialog = flag;
  }

  updateAction(customer: any, index: number) {
    this.selectedCustomer = customer;
    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, customer);
  }

  deleteAction(customer: any, index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this customer?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          if (customer._id) {
            console.log('Accepted');
            this.deleteCustomer(customer._id);
          }
      },
      reject: () => {
          console.log('Rejected');
      },
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'mr-4 mt-3 inline-flex w-full justify-center rounded-md text-white px-3 py-2 text-sm font-semibold bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto',
      acceptButtonStyleClass: 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800 hover:text-gray-50 sm:mt-0 sm:w-auto'
    });
  }

  private loadCustomers$(): Observable<CustomersPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getCustomers$(this.params, page)),
      scan(this.updatePaginator, {customers: [], page: 0, hasMorePages: true} as CustomersPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: CustomersPaginator, value: CustomersPaginator): CustomersPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.customers.push(...value.customers);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreCustomers(paginator: CustomersPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }

  generateMenuItems(event: MouseEvent, customer: any, index: number) {
    event.stopPropagation();
    event.preventDefault();
    
    this.actionItems = [
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(customer, index)
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => this.deleteAction(customer, index)
      }
    ]
  }

  onAddCustomer(event: any) {
    console.log(event)
    this.showUpdateDialog = true;
  }

  onSubmit(formData: any) {
    console.log(formData);
    if (this.selectedCustomer && this.selectedCustomer._id) {
      this.updateCustomer(this.selectedCustomer._id, formData);
    } else {
      this.createCustomer(formData);
    }
    // this.loadCompanies$().subscribe(() => {})
  }

  onCancel(event: boolean) {
    if (event) {
      this.showUpdateDialog = false;
      this.selectedCustomer = null;
    }
  }

  updateCustomer(customerId: string, data: any) {
    this.api.updateCustomer$(customerId, data).subscribe({
      next: (response) => {
        this.showUpdateDialog = false;
        this.selectedCustomer = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  createCustomer(data: any) {
    this.api.createCustomer$(data).subscribe({
      next: (response) => {
        this.showUpdateDialog = false;
        this.selectedCustomer = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  deleteCustomer(customerId: string) {
    this.api.deleteCustomer$(customerId).subscribe({
      next: (response) => {
        console.log('Deletion successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Deletion failed', error)
        this.handleError(error);
      }
    });
  }

  showError(summary:string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail
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

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  
}
