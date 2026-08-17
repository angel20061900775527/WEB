import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriosDeleted } from './auditorios-deleted';

describe('AuditoriosDeleted', () => {
  let component: AuditoriosDeleted;
  let fixture: ComponentFixture<AuditoriosDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriosDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriosDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
