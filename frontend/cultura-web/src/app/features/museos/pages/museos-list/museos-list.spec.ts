import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuseosList } from './museos-list';

describe('MuseosList', () => {
  let component: MuseosList;
  let fixture: ComponentFixture<MuseosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuseosList],
    }).compileComponents();

    fixture = TestBed.createComponent(MuseosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
