import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentosCreate } from './monumentos-create';

describe('MonumentosCreate', () => {
  let component: MonumentosCreate;
  let fixture: ComponentFixture<MonumentosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MonumentosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
