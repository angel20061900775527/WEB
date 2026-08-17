import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriosDetail } from './auditorios-detail';

describe('AuditoriosDetail', () => {
  let component: AuditoriosDetail;
  let fixture: ComponentFixture<AuditoriosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriosDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
