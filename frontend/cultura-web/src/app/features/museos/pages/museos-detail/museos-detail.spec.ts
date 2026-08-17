import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuseosDetail } from './museos-detail';

describe('MuseosDetail', () => {
  let component: MuseosDetail;
  let fixture: ComponentFixture<MuseosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuseosDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MuseosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
