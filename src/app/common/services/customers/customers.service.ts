import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CustomerJsonResponse, CustomersPaginator } from '@common/interfaces/customers.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }


  public getCustomers$(params: any, page: number = 1, itemsPerPage: number = 16): Observable<CustomersPaginator> {
    return this.http.get<CustomerJsonResponse>(
      '/customers',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1),
          ...params
        }
      }
    ).pipe(
      map((response) => ({
        customers: response.customers,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as CustomersPaginator))
    );
  }

  public createCustomer$(updateData: any): Observable<any> {
    return this.http.post(`/customers`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateCustomer$(customerId: string, updateData: any): Observable<any> {
    return this.http.put(`/customers/${customerId}`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteCustomer$(customerId: string): Observable<any> {
    return this.http.delete(`/customers/${customerId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }
}
