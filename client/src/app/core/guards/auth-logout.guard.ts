import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminloginService } from '../service/auth/adminlogin.service';

export const authLogoutGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminloginService);
  const router = inject(Router);
  const token = adminService.getTokens();

  console.log('adminloggedOutGuard: Token:', token);

  if (token) {
   
      console.log('Redirecting to admin portal');
      router.navigate(['/dashboard']);
  
    return false;
    
  } else {

    return true;
  }
};
