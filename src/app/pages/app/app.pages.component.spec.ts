import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppPagesComponent } from './app.pages.component';

describe('AppPagesComponent', () => {
  let component: AppPagesComponent;
  let fixture: ComponentFixture<AppPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
