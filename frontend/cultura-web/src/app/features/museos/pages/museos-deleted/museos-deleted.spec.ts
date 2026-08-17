import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuseosDeleted } from './museos-deleted';

describe('MuseosDeleted', () => {
  let component: MuseosDeleted;
  let fixture: ComponentFixture<MuseosDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuseosDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(MuseosDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
