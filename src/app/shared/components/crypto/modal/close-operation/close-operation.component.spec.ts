import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseOperationComponent } from './close-operation.component';

describe('CloseOperationComponent', () => {
  let component: CloseOperationComponent;
  let fixture: ComponentFixture<CloseOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseOperationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
