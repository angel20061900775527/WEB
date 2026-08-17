import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiosList } from './rios-list';

describe('RiosList', () => {
  let component: RiosList;
  let fixture: ComponentFixture<RiosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiosList],
    }).compileComponents();

    fixture = TestBed.createComponent(RiosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
