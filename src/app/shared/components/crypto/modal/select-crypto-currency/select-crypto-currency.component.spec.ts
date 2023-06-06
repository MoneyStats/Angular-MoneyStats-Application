import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCryptoCurrencyComponent } from './select-crypto-currency.component';

describe('SelectCryptoCurrencyComponent', () => {
  let component: SelectCryptoCurrencyComponent;
  let fixture: ComponentFixture<SelectCryptoCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCryptoCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCryptoCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
