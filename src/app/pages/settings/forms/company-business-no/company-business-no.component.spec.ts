import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBusinessNoComponent } from './company-business-no.component';

describe('CompanyBusinessNoComponent', () => {
  let component: CompanyBusinessNoComponent;
  let fixture: ComponentFixture<CompanyBusinessNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBusinessNoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyBusinessNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
