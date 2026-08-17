import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriosEdit } from './auditorios-edit';

describe('AuditoriosEdit', () => {
  let component: AuditoriosEdit;
  let fixture: ComponentFixture<AuditoriosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
