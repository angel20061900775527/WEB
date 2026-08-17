import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazasDetail } from './plazas-detail';

describe('PlazasDetail', () => {
  let component: PlazasDetail;
  let fixture: ComponentFixture<PlazasDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazasDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PlazasDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
