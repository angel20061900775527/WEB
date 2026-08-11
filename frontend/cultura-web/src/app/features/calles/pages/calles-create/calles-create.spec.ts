import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallesCreate } from './calles-create';

describe('CallesCreate', () => {
  let component: CallesCreate;
  let fixture: ComponentFixture<CallesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallesCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(CallesCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
