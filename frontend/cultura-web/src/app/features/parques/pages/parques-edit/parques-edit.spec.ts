import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParquesEdit } from './parques-edit';

describe('ParquesEdit', () => {
  let component: ParquesEdit;
  let fixture: ComponentFixture<ParquesEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParquesEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ParquesEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
