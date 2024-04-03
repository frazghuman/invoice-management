import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { InvoicesJsonResponse, InvoicesPaginator } from '@common/interfaces/invoices.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService  extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  public getInvoices$(page: number = 1, InvoicesPerPage: number = 16): Observable<InvoicesPaginator> {
    return this.http.get<InvoicesJsonResponse>(
      'https://dummyjson.com/carts',
      {
        params: {
          limit: InvoicesPerPage,
          skip: InvoicesPerPage * (page - 1)
        }
      }
    )
    .pipe(
      map((response: any) => {
        return {
          invoices: response.carts,
          ...response
        }
      })
    )
    .pipe(
      map((response) => ({
        invoices: response.invoices,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as InvoicesPaginator))
    );
  }
}
