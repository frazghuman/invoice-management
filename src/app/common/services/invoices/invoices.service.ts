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

  public getInvoices$(params: any, page: number = 1, InvoicesPerPage: number = 16): Observable<InvoicesPaginator> {
    return this.http.get<InvoicesJsonResponse>(
      '/invoices',
      {
        params: {
          limit: InvoicesPerPage,
          skip: InvoicesPerPage * (page - 1),
          ...params
        }
      }
    )
    .pipe(
      map((response: any) => {
        return {
          invoices: response.invoices,
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

  public createInvoice$(createData: any): Observable<any> {
    return this.http.post(`/invoices`, createData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateInvoice$(invoiceObjectId: string, createData: any): Observable<any> {
    return this.http.put(`/invoices/${invoiceObjectId}`, createData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getInvoice$(invoiceObjectId: string): Observable<any> {
    return this.http.get(`/invoices/${invoiceObjectId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }
}
