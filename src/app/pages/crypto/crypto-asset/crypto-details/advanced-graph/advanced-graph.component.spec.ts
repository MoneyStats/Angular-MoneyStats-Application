import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedGraphComponent } from './advanced-graph.component';

describe('AdvancedGraphComponent', () => {
  let component: AdvancedGraphComponent;
  let fixture: ComponentFixture<AdvancedGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
