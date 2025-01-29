import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminloginService } from '../service/auth/adminlogin.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const adminService = inject(AdminloginService);

  const token = adminService.getTokens();
  console.log('Token from Admin Interceptor:', token);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  } else {
    console.log('Admin token not found at the moment of request.');
  }
    
  return next(req);
  
};
