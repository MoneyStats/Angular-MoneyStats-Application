import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBugComponent } from './open-bug.component';

describe('OpenBugComponent', () => {
  let component: OpenBugComponent;
  let fixture: ComponentFixture<OpenBugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenBugComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
