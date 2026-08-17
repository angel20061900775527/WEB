import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasDeleted } from './plazas-deleted';

describe('PlazasDeleted', () => {
  let component: PlazasDeleted;
  let fixture: ComponentFixture<PlazasDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazasDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(PlazasDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
