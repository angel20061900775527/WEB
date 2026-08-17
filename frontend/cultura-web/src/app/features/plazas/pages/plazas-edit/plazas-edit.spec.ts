import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasEdit } from './plazas-edit';

describe('PlazasEdit', () => {
  let component: PlazasEdit;
  let fixture: ComponentFixture<PlazasEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazasEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(PlazasEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
