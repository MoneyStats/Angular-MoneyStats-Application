import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAppComponent } from './info-app.component';

describe('InfoAppComponent', () => {
  let component: InfoAppComponent;
  let fixture: ComponentFixture<InfoAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
