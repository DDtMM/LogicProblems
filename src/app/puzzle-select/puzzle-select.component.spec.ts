import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSelectComponent } from './puzzle-select.component';

describe('PuzzleSelectComponent', () => {
  let component: PuzzleSelectComponent;
  let fixture: ComponentFixture<PuzzleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
