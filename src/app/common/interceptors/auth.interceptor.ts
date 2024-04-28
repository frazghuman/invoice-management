import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '@common/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.authService.getAccessToken();

    // Exclude URLs that start with '/auth'
    if (accessToken && !req.url.startsWith('/auth/login')) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
