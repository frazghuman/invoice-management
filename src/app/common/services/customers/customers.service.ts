import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DummyJsonResponse, CustomersPaginator } from '@common/interfaces/customers.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }


  public getCustomers$(page: number = 1, itemsPerPage: number = 16): Observable<CustomersPaginator> {
    return this.http.get<DummyJsonResponse>(
      'https://dummyjson.com/users',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1)
        }
      }
    ).pipe(
      map((response) => ({
        customers: response.users,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as CustomersPaginator))
    );
  }
}
