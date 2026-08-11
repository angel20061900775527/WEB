import { TestBed } from '@angular/core/testing';

import { Parques } from './parques';

describe('Parques', () => {
  let service: Parques;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Parques);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
