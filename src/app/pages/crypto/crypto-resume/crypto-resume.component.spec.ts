import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoResumeComponent } from './crypto-resume.component';

describe('CryptoResumeComponent', () => {
  let component: CryptoResumeComponent;
  let fixture: ComponentFixture<CryptoResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
