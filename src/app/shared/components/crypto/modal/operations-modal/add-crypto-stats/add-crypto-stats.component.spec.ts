import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCryptoStatsComponent } from './add-crypto-stats.component';

describe('AddCryptoStatsComponent', () => {
  let component: AddCryptoStatsComponent;
  let fixture: ComponentFixture<AddCryptoStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCryptoStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCryptoStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
