import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiResetPasswordComponent } from './verifi-reset-password.component';

describe('VerifiResetPasswordComponent', () => {
  let component: VerifiResetPasswordComponent;
  let fixture: ComponentFixture<VerifiResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
