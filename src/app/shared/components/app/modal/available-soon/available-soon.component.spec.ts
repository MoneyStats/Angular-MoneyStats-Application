import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableSoonComponent } from './available-soon.component';

describe('AvailableSoonComponent', () => {
  let component: AvailableSoonComponent;
  let fixture: ComponentFixture<AvailableSoonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableSoonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
