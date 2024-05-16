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
}
