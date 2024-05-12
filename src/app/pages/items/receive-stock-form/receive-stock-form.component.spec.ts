import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveStockFormComponent } from './receive-stock-form.component';

describe('ReceiveStockFormComponent', () => {
  let component: ReceiveStockFormComponent;
  let fixture: ComponentFixture<ReceiveStockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiveStockFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReceiveStockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
