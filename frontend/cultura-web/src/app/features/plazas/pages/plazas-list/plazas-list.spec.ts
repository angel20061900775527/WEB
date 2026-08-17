import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasList } from './plazas-list';

describe('PlazasList', () => {
  let component: PlazasList;
  let fixture: ComponentFixture<PlazasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazasList],
    }).compileComponents();

    fixture = TestBed.createComponent(PlazasList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
