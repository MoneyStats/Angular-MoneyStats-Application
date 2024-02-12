import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAssetsComponent } from './resume-assets.component';

describe('ResumeAssetsComponent', () => {
  let component: ResumeAssetsComponent;
  let fixture: ComponentFixture<ResumeAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
