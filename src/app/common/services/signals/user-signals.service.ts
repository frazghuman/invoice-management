import { Injectable } from "@angular/core";
import { BaseSignalsStoreService } from "./signal-base.service";

export interface UserState {
    name: string;
    company: string;
    address: string;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class UserSignalsStateService extends BaseSignalsStoreService<UserState> {
    constructor() {
      super();
    }
  }