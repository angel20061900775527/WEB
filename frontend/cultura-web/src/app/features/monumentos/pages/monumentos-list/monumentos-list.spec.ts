import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonumentosList } from './monumentos-list';

describe('MonumentosList', () => {
  let component: MonumentosList;
  let fixture: ComponentFixture<MonumentosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonumentosList],
    }).compileComponents();

    fixture = TestBed.createComponent(MonumentosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
