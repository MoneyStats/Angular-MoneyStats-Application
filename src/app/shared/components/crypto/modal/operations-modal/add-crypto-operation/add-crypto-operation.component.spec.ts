import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCryptoOperationComponent } from './add-crypto-operation.component';

describe('AddCryptoOperationComponent', () => {
  let component: AddCryptoOperationComponent;
  let fixture: ComponentFixture<AddCryptoOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCryptoOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCryptoOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
