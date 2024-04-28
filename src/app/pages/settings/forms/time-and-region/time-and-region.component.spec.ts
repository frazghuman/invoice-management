import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAndRegionComponent } from './time-and-region.component';

describe('TimeAndRegionComponent', () => {
  let component: TimeAndRegionComponent;
  let fixture: ComponentFixture<TimeAndRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeAndRegionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeAndRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
