import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParquesDeleted } from './parques-deleted';

describe('ParquesDeleted', () => {
  let component: ParquesDeleted;
  let fixture: ComponentFixture<ParquesDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParquesDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(ParquesDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
