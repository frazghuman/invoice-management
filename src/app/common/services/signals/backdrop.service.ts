import { Injectable } from "@angular/core";
import { BaseSignalsStoreService } from "./signal-base.service";

export interface BackdropState {
    visible: boolean
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class BackdropService extends BaseSignalsStoreService<BackdropState> {
    constructor() {
      super();
    }
  }