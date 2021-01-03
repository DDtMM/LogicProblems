import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemGridComponent } from './problem-grid.component';

describe('ProblemGridComponent', () => {
  let component: ProblemGridComponent;
  let fixture: ComponentFixture<ProblemGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
