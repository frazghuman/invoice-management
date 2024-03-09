import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ItemsJsonResponse, ItemsPaginator } from '@common/interfaces/items.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  public getItems$(page: number = 1, itemsPerPage: number = 16): Observable<ItemsPaginator> {
    return this.http.get<ItemsJsonResponse>(
      'https://dummyjson.com/products',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1)
        }
      }
    ).pipe(
      map((response) => ({
        products: response.products,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as ItemsPaginator))
    );
  }
}
