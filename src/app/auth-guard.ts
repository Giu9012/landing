import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getRole();
  const allowedRoles = route.data['roles'] as string[];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
