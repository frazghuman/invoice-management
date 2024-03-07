import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { CustomersPaginator } from '@common/interfaces/customers.interface';
import { CustomersService } from '@common/services/customers/customers.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, Observable, scan, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, HttpClientModule, InfiniteScrollModule, PageHeaderComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  private api = inject(CustomersService);

  public paginator$: Observable<CustomersPaginator>;

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  constructor() {
    this.paginator$ = this.loadCustomers$();
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
}
