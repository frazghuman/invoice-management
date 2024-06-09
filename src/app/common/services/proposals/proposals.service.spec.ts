import { TestBed } from '@angular/core/testing';

import { ProposalsService } from './proposals.service';

describe('ProposalsService', () => {
  let service: ProposalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
