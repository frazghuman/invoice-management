import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUserImageComponent } from './account-user-image.component';

describe('AccountUserImageComponent', () => {
  let component: AccountUserImageComponent;
  let fixture: ComponentFixture<AccountUserImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountUserImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountUserImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
