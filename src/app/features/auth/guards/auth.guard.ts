import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import jwt_decode from 'jwt-decode';

const checkTokenExpiration = (token: string): boolean => {
  const decodedToken: any = jwt_decode(token);
  const expirationDate = decodedToken.exp * 1000;
  const currentTime = new Date().getTime();
  return expirationDate >= currentTime;
};

const handleUnauthorized = (router: Router, state: any) => {
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();
  let token = cookieService.get('Authorization');

  if (token && user) {
    token = token.replace('Bearer ', '');

    if (checkTokenExpiration(token)) {
      if (user.roles.includes('Writer')) {
        return true;
      } else {
        alert('Unauthorized');
        return false;
      }
    } else {
      authService.logout();
      handleUnauthorized(router, state);
      return false;
    }
  } else {
    authService.logout();
    handleUnauthorized(router, state);
    return false;
  }
};
