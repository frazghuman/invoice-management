import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DummyJsonResponse, UsersManagementPaginator } from '@common/interfaces/user-management.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }


  public getUsersManagement$(page: number = 1, itemsPerPage: number = 16): Observable<UsersManagementPaginator> {
    return this.http.get<DummyJsonResponse>(
      'https://dummyjson.com/users',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1)
        }
      }
    ).pipe(
      map((response) => ({
        usersManagement: response.users,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as UsersManagementPaginator))
    );
  }
}
