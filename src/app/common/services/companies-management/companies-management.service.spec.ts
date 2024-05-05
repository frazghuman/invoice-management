import { TestBed } from '@angular/core/testing';

import { CompaniesManagementService } from './companies-management.service';

describe('CompaniesManagementService', () => {
  let service: CompaniesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
