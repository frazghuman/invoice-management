import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProposalsJsonResponse, ProposalsPaginator } from '@common/interfaces/proposals.interface';

@Injectable({
  providedIn: 'root'
})
export class ProposalsService  extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  public getProposals$(params: any, page: number = 1, ProposalsPerPage: number = 16): Observable<ProposalsPaginator> {
    return this.http.get<ProposalsJsonResponse>(
      '/proposals',
      {
        params: {
          limit: ProposalsPerPage,
          skip: ProposalsPerPage * (page - 1),
          ...params
        }
      }
    )
    .pipe(
      map((response: any) => {
        return {
          proposals: response.proposals,
          ...response
        }
      })
    )
    .pipe(
      map((response) => ({
        proposals: response.proposals,
        page: page,
        hasMorePages: response.skip + response.limit < response.total
      } as ProposalsPaginator))
    );
  }

  public createProposal$(createData: any): Observable<any> {
    return this.http.post(`/proposals`, createData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateProposal$(proposalObjectId: string, createData: any): Observable<any> {
    return this.http.put(`/proposals/${proposalObjectId}`, createData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getProposal$(proposalObjectId: string): Observable<any> {
    return this.http.get(`/proposals/${proposalObjectId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }
}
