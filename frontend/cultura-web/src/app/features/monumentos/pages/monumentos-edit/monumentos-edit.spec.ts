import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentosEdit } from './monumentos-edit';

describe('MonumentosEdit', () => {
  let component: MonumentosEdit;
  let fixture: ComponentFixture<MonumentosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(MonumentosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
