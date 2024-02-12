import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplideSlideComponent } from './splide-slide.component';

describe('SplideSlideComponent', () => {
  let component: SplideSlideComponent;
  let fixture: ComponentFixture<SplideSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplideSlideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplideSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
