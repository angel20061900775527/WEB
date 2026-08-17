import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiosCreate } from './rios-create';

describe('RiosCreate', () => {
  let component: RiosCreate;
  let fixture: ComponentFixture<RiosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiosCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(RiosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
