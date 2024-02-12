import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoDashboardComponent } from './crypto-dashboard.component';

describe('CryptoDashboardComponent', () => {
  let component: CryptoDashboardComponent;
  let fixture: ComponentFixture<CryptoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
