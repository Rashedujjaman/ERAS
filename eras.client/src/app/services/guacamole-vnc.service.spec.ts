import { TestBed } from '@angular/core/testing';

import { GuacamoleVncService } from './guacamole-vnc.service';

describe('GuacamoleVncService', () => {
  let service: GuacamoleVncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuacamoleVncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
