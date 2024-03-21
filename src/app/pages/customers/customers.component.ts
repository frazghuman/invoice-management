import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { CustomersPaginator } from '@common/interfaces/customers.interface';
import { CustomersService } from '@common/services/customers/customers.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable, scan, switchMap, tap } from 'rxjs';
import { MenuModule } from 'primeng/menu';

import * as _ from 'lodash';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    PageHeaderComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  private api = inject(CustomersService);

  public paginator$: Observable<CustomersPaginator>;

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  actionItems!: MenuItem[];

  showUpdateDialog: boolean = false;
  selectedCustomer: any;

  constructor() {
    this.paginator$ = this.loadCustomers$();
  }

  ngOnInit(): void {
  }

  onHideUpdateDialog(flag: boolean) {
    this.showUpdateDialog = flag;
  }

  updateAction(customer: any, index: number) {
    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, customer);
    this.selectedCustomer = customer;
  }

  deleteAction(customer: any, index: number) {
      // Your delete logic here
      console.log('Delete action triggered'+index, customer);
  }

  private loadCustomers$(): Observable<CustomersPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getCustomers$(page)),
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

  generateMenuItems(customer: any, index: number) {
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

}
