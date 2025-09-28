import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (typeof window === 'undefined') {
    return true;
  }

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
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
        router.navigate(['/']);
        return false;
      }
    })
  );
};
