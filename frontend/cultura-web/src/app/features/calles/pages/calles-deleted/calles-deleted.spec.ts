import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallesDeleted } from './calles-deleted';

describe('CallesDeleted', () => {
  let component: CallesDeleted;
  let fixture: ComponentFixture<CallesDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallesDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(CallesDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
