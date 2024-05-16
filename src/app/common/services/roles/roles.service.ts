import { inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  public getAllRoles$(): Observable<any> {
    return this.http.get<any>(
      '/roles'
    ).pipe(
      map((response) => ({
        roles: response
      } as any))
    );
  }
}
