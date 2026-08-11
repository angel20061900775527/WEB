import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallesDetail } from './calles-detail';

describe('CallesDetail', () => {
  let component: CallesDetail;
  let fixture: ComponentFixture<CallesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallesDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(CallesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
