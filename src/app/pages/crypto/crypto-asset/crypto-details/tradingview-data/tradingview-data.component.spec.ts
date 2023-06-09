import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingviewDataComponent } from './tradingview-data.component';

describe('TradingviewDataComponent', () => {
  let component: TradingviewDataComponent;
  let fixture: ComponentFixture<TradingviewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradingviewDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingviewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
