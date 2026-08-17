import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiosDeleted } from './rios-deleted';

describe('RiosDeleted', () => {
  let component: RiosDeleted;
  let fixture: ComponentFixture<RiosDeleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiosDeleted],
    }).compileComponents();

    fixture = TestBed.createComponent(RiosDeleted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
