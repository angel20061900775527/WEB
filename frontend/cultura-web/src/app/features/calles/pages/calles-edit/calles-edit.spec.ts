import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallesEdit } from './calles-edit';

describe('CallesEdit', () => {
  let component: CallesEdit;
  let fixture: ComponentFixture<CallesEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallesEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CallesEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
