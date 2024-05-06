import { inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CompaniesJsonResponse, CompaniesManagementPaginator } from '@common/interfaces/companies-management.interface';

@Injectable({
  providedIn: 'root'
})
export class CompaniesManagementService extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }


  public getCompaniesManagement$(params: any, page: number = 1, itemsPerPage: number = 16): Observable<CompaniesManagementPaginator> {
    return this.http.get<CompaniesJsonResponse>(
      '/companies',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1),
          ...params
        }
      }
    ).pipe(
      map((response) => ({
        companies: response.companies,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as CompaniesManagementPaginator))
    );
  }

  public createCompany$(updateData: any): Observable<any> {
    return this.http.post(`/companies`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateCompany$(companyId: string, updateData: any): Observable<any> {
    return this.http.put(`/companies/${companyId}`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteCompany$(companyId: string): Observable<any> {
    return this.http.delete(`/companies/${companyId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }
}

