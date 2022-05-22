import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CateFormComponent } from './cate-form.component';

describe('CateFormComponent', () => {
  let component: CateFormComponent;
  let fixture: ComponentFixture<CateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
