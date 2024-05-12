import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePriceAdjustmentFormComponent } from './sale-price-adjustment-form.component';

describe('SalePriceAdjustmentFormComponent', () => {
  let component: SalePriceAdjustmentFormComponent;
  let fixture: ComponentFixture<SalePriceAdjustmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalePriceAdjustmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalePriceAdjustmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
