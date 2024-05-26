import { inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { DataSharingService } from '../data-sharing/data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService {
  private http = inject(HttpClient);
  private dataSharingService = inject(DataSharingService);

  constructor() {
    super();
  }

  public getUserSettings$(): Observable<any> {
    return this.http.get(`/users/current/settings`)
      .pipe(
        tap((data) => {
          // Update the user settings in DataSharingService
          this.dataSharingService.setUserSettings(data);
        }),
        map((response: any) => {
          // Process the response if needed
          return response;
        })
      );
  }

  updateUserSettings(settings: any): Observable<any> {
    return this.http.put(`/users/current/settings`, settings);
  }

  public getUserCompanies$(): Observable<any> {
    return this.http.get(`/users/current/companies`)
      .pipe(
        tap((data) => {
          // Update the user settings in DataSharingService
          this.dataSharingService.setUserCompanies(data);
        }),
        map((response: any) => {
          // Process the response if needed
          return response;
        })
      );
  }
}
