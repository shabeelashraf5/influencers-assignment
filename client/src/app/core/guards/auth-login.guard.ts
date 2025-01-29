import { CanActivateFn, Router } from '@angular/router';
import { AdminloginService } from '../service/auth/adminlogin.service';
import { inject } from '@angular/core';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminloginService);
  const router = inject(Router);
  const token = adminService.getTokens();

  console.log('adminloggedInGuard: Token:', token);

  if (token) {
    console.log('Admin is logged in, allowing access to admin route.');
    return true;
  } else {
    console.log('Admin is not logged in, redirecting to /admin-login');
    router.navigate(['/admin-login']);

    return false;
  }
};
