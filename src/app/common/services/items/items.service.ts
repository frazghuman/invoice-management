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
      '/items',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1)
        }
      }
    ).pipe(
      map((response) => ({
        items: response.items,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as ItemsPaginator))
    );
  }

  public createItem$(updateData: any): Observable<any> {
    return this.http.post(`/items`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateItem$(itemId: string, updateData: any): Observable<any> {
    return this.http.put(`/items/${itemId}`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteItem$(itemId: string): Observable<any> {
    return this.http.delete(`/items/${itemId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public addItemPrice$(itemId: string, updateData: any): Observable<any> {
    return this.http.post(`/items/${itemId}/prices`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }
  
}
