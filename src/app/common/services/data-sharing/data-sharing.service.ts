import { inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService extends BaseService {
  private http = inject(HttpClient);

  // Define signals to store the user settings data
  private _userSettings = signal<any>(null);
  public userSettings: Signal<any> = this._userSettings.asReadonly();

  private _userCompanies = signal<any>(null);
  public userCompanies: Signal<any> = this._userCompanies.asReadonly();

  constructor() {
    super();
  }

  // Method to update user settings signal
  setUserSettings(settings: any) {
    this._userSettings.set(settings);
  }

  // Method to update user companies signal
  setUserCompanies(settings: any) {
    this._userCompanies.set(settings);
  }
}
