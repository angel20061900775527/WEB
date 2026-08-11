import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParquesDetail } from './parques-detail';

describe('ParquesDetail', () => {
  let component: ParquesDetail;
  let fixture: ComponentFixture<ParquesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParquesDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ParquesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
