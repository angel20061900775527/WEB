import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiosDetail } from './rios-detail';

describe('RiosDetail', () => {
  let component: RiosDetail;
  let fixture: ComponentFixture<RiosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiosDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(RiosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
