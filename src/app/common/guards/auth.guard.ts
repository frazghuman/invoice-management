import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '@common/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      // User is authenticated, allow access to the route
      return of(true);
    } else {
      // User is not authenticated, attempt to refresh the token
      return this.authService.refreshToken().pipe(
        map((response: any) => {
          if (response && response.accessToken) {
            // Token refresh was successful, allow access to the route
            return true;
          } else {
            // Token refresh failed, redirect to the sign-in page
            this.router.navigate(['/auth/sign-in']);
            return false;
          }
        }),
        catchError(() => {
          // Error occurred during token refresh, redirect to the sign-in page
          this.router.navigate(['/auth/sign-in']);
          return of(false);
        })
      );
    }
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  return inject(PermissionsService).canActivate(next, state);
}