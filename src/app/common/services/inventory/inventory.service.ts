import { inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  public receiveInventory$(inventoryReceiveData: any): Observable<any> {
    return this.http.post(`/inventory/receive`, inventoryReceiveData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateInventory$(inventoryData: any, inventoryId: string): Observable<any> {
    return this.http.put(`/inventory/${inventoryId}`, inventoryData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteInventory$(inventoryId: string): Observable<any> {
    return this.http.delete(`/inventory/${inventoryId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public largestLotNo$(itemId: string): Observable<any> {
    return this.http.get(`/inventory/${itemId}/largest-lot-no`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public inventoriesByItemId$(itemId: string): Observable<any> {
    return this.http.get(`/inventory/${itemId}/inventories`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

}
