import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasCreate } from './plazas-create';

describe('PlazasCreate', () => {
  let component: PlazasCreate;
  let fixture: ComponentFixture<PlazasCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazasCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(PlazasCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
