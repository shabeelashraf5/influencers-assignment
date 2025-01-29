import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authLogoutGuard } from './auth-logout.guard';

describe('authLogoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authLogoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
