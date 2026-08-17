import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentosDetail } from './monumentos-detail';

describe('MonumentosDetail', () => {
  let component: MonumentosDetail;
  let fixture: ComponentFixture<MonumentosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentosDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MonumentosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
