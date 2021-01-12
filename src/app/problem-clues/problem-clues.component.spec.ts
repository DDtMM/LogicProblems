import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemCluesComponent } from './problem-clues.component';

describe('ProblemCluesComponent', () => {
  let component: ProblemCluesComponent;
  let fixture: ComponentFixture<ProblemCluesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemCluesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemCluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
