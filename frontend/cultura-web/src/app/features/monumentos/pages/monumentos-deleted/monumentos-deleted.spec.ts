import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentosDeleted } from './monumentos-deleted';

describe('MonumentosDeleted', () => {
  let component: MonumentosDeleted;
  let fixture: ComponentFixture<MonumentosDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentosDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(MonumentosDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
