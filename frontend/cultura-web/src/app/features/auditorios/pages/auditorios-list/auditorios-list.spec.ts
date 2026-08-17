import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriosList } from './auditorios-list';

describe('AuditoriosList', () => {
  let component: AuditoriosList;
  let fixture: ComponentFixture<AuditoriosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditoriosList],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditoriosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
