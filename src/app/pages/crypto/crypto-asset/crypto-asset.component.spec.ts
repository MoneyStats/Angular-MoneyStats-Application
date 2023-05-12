import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoAssetComponent } from './crypto-asset.component';

describe('CryptoAssetComponent', () => {
  let component: CryptoAssetComponent;
  let fixture: ComponentFixture<CryptoAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoAssetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
