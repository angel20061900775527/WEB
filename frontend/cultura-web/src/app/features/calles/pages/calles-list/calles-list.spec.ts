import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallesList } from './calles-list';

describe('CallesList', () => {
  let component: CallesList;
  let fixture: ComponentFixture<CallesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallesList],
    }).compileComponents();

    fixture = TestBed.createComponent(CallesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
