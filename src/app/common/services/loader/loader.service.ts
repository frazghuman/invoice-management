import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  waiting = signal<boolean>(false);
  constructor() {
    
  }

  toggleWaiting(status: boolean) {
    this.waiting.update(() => status);
  }
}
