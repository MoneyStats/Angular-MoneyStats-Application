import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSelectComponent } from './asset-select.component';

describe('AssetSelectComponent', () => {
  let component: AssetSelectComponent;
  let fixture: ComponentFixture<AssetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
