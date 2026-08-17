import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiosEdit } from './rios-edit';

describe('RiosEdit', () => {
  let component: RiosEdit;
  let fixture: ComponentFixture<RiosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(RiosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
