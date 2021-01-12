import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemHostComponent } from './problem-host.component';

describe('ProblemHostComponent', () => {
  let component: ProblemHostComponent;
  let fixture: ComponentFixture<ProblemHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemHostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
