import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParquesCreate } from './parques-create';

describe('ParquesCreate', () => {
  let component: ParquesCreate;
  let fixture: ComponentFixture<ParquesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParquesCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ParquesCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
