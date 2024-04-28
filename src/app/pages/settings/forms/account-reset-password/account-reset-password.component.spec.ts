import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountResetPasswordComponent } from './account-reset-password.component';

describe('AccountResetPasswordComponent', () => {
  let component: AccountResetPasswordComponent;
  let fixture: ComponentFixture<AccountResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountResetPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
