import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingResumeComponent } from './trading-resume.component';

describe('TradingResumeComponent', () => {
  let component: TradingResumeComponent;
  let fixture: ComponentFixture<TradingResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradingResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
