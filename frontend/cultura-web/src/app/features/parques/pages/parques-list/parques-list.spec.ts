import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParquesList } from './parques-list';

describe('ParquesList', () => {
  let component: ParquesList;
  let fixture: ComponentFixture<ParquesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParquesList],
    }).compileComponents();

    fixture = TestBed.createComponent(ParquesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
