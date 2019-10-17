import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getEncodedToken();
    if (token) {
      if (token[0] == '"' && token[token.length - 1] == '"') {
        token = token.substr(1);
        token = token.slice(0, -1);
      }
    }

    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

    if (this.authService.isLoggedIn() && token) {
      req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    }

    return next.handle(req);
  }
}
