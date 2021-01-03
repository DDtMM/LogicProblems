import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemGridItemComponent } from './problem-grid-item.component';

describe('ProblemGridItemComponent', () => {
  let component: ProblemGridItemComponent;
  let fixture: ComponentFixture<ProblemGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
