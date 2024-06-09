import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserJsonResponse, UsersManagementPaginator } from '@common/interfaces/user-management.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }


  public getUsersManagement$(params: any, page: number = 1, itemsPerPage: number = 16): Observable<UsersManagementPaginator> {
    return this.http.get<UserJsonResponse>(
      '/users',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1),
          ...params
        }
      }
    ).pipe(
      map((response) => ({
        users: response.users,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as UsersManagementPaginator))
    );
  }

  public createUser$(updateData: any): Observable<any> {
    return this.http.post(`/users`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateUser$(userId: string, updateData: any): Observable<any> {
    return this.http.put(`/users/${userId}`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteUser$(userId: string): Observable<any> {
    return this.http.delete(`/users/${userId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getUserByVerificationKey$(activationKey: string): Observable<any> {
    return this.http.get(`/users/verify/${activationKey}`)
      .pipe(
        map((response: any) => {
          // Process the response if needed
          return response;
        })
      );
  }

  public activateUser$(activationKey: string, verificationData: any): Observable<any> {
    return this.http.put(`/users/verify/${activationKey}`, verificationData)
      .pipe(
        map((response: any) => {
          // Process the response if needed
          return response;
        })
      );
  }

  public copyActivationLink$(userId: string): Observable<any> {
    return this.http.get(`/users/${userId}/activation/link`)
      .pipe(
        map((response: any) => {
          // Process the response if needed
          return response.activationKey;
        })
      );
  }

  public resetPassword$(userId: string, passwordResetForm: any): Observable<any> {
    return this.http.put(`/users/${userId}/password/reset`, passwordResetForm)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }
}
