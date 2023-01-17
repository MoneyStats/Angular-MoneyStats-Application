import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleDesktopComponent } from './title-desktop.component';

describe('TitleDesktopComponent', () => {
  let component: TitleDesktopComponent;
  let fixture: ComponentFixture<TitleDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleDesktopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
