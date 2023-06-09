import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsModalComponent } from './operations-modal.component';

describe('OperationsModalComponent', () => {
  let component: OperationsModalComponent;
  let fixture: ComponentFixture<OperationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
