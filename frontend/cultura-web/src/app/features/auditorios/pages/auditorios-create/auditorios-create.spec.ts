import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriosCreate } from './auditorios-create';

describe('AuditoriosCreate', () => {
  let component: AuditoriosCreate;
  let fixture: ComponentFixture<AuditoriosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
